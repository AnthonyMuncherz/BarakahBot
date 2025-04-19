'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite-client';
import { ID, Query } from 'appwrite';
import { useToast } from '@/components/ui/use-toast';

interface SaveCampaignButtonProps {
  campaignId: string;
  className?: string;
}

export default function SaveCampaignButton({ campaignId, className }: SaveCampaignButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkIfSaved();
  }, [campaignId, user]);

  const checkIfSaved = async () => {
    if (!user) return;

    try {
      const response = await databases.listDocuments(
        'barakah_db',
        'saved_campaigns',
        [
          Query.equal('user_id', user.$id),
          Query.equal('campaign_id', campaignId),
          Query.limit(1)
        ]
      );

      setIsSaved(response.documents.length > 0);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to save campaigns",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        // Find and delete the saved campaign record
        const response = await databases.listDocuments(
          'barakah_db',
          'saved_campaigns',
          [
            Query.equal('user_id', user.$id),
            Query.equal('campaign_id', campaignId),
            Query.limit(1)
          ]
        );

        if (response.documents.length > 0) {
          await databases.deleteDocument(
            'barakah_db',
            'saved_campaigns',
            response.documents[0].$id
          );
        }

        setIsSaved(false);
        toast({
          title: "Campaign Unsaved",
          description: "Campaign has been removed from your saved list",
        });
      } else {
        // Save the campaign
        await databases.createDocument(
          'barakah_db',
          'saved_campaigns',
          ID.unique(),
          {
            user_id: user.$id,
            campaign_id: campaignId,
            saved_at: new Date().toISOString(),
          }
        );

        setIsSaved(true);
        toast({
          title: "Campaign Saved",
          description: "Campaign has been added to your saved list",
        });
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign save status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={handleToggleSave}
      disabled={isLoading}
    >
      <Heart
        className={`w-5 h-5 ${isSaved ? 'fill-current text-red-500' : 'text-gray-500'}`}
      />
    </Button>
  );
} 