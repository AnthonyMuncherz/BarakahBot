'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";

export default function ExamplesPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Animation Examples</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Staggered Grid Layout</h2>
        <AnimatedContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              animated
              direction={i % 3 === 0 ? 'left' : i % 3 === 1 ? 'up' : 'right'}
              delay={i * 0.1}
            >
              <CardHeader>
                <CardTitle>Card {i + 1}</CardTitle>
                <CardDescription>This card animates from the {i % 3 === 0 ? 'left' : i % 3 === 1 ? 'bottom' : 'right'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is an example of our new animated card component using Framer Motion.</p>
              </CardContent>
              <CardFooter>
                <Button>Learn More</Button>
              </CardFooter>
            </Card>
          ))}
        </AnimatedContainer>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Single Column Layout</h2>
        <AnimatedContainer className="max-w-2xl mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              animated
              direction="up"
              delay={i * 0.2}
              className="w-full"
            >
              <CardHeader>
                <CardTitle>Vertical Card {i + 1}</CardTitle>
                <CardDescription>This card animates from the bottom</CardDescription>
              </CardHeader>
              <CardContent>
                <p>An example of a full-width card in a single column layout with staggered animations.</p>
              </CardContent>
              <CardFooter>
                <Button>Learn More</Button>
              </CardFooter>
            </Card>
          ))}
        </AnimatedContainer>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Mixed Directions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatedContainer>
            <Card animated direction="left">
              <CardHeader>
                <CardTitle>Left Card</CardTitle>
                <CardDescription>This card slides in from the left</CardDescription>
              </CardHeader>
              <CardContent>
                <p>An example of a card that animates from the left side of the screen.</p>
              </CardContent>
            </Card>
          </AnimatedContainer>

          <AnimatedContainer>
            <Card animated direction="right">
              <CardHeader>
                <CardTitle>Right Card</CardTitle>
                <CardDescription>This card slides in from the right</CardDescription>
              </CardHeader>
              <CardContent>
                <p>An example of a card that animates from the right side of the screen.</p>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </div>
      </section>
    </div>
  );
} 