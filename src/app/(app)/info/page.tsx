
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, Info, GitCommit, MessageSquare, Cat, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InfoPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="page-title text-teal-500">Info</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="how-to-play" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="how-to-play" className="bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 data-[state=active]:bg-background data-[state=active]:text-foreground">How to Play</TabsTrigger>
                        <TabsTrigger value="schrodinger" className="bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 data-[state=active]:bg-background data-[state=active]:text-foreground">Schrödinger</TabsTrigger>
                        <TabsTrigger value="about" className="bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200 data-[state=active]:bg-background data-[state=active]:text-foreground">About</TabsTrigger>
                        <TabsTrigger value="feedback" className="bg-pink-200 text-pink-800 dark:bg-pink-800 dark:text-pink-200 data-[state=active]:bg-background data-[state=active]:text-foreground">Contact</TabsTrigger>
                    </TabsList>
                    <TabsContent value="how-to-play">
                        <Card>
                            <CardHeader>
                                <CardTitle className="section-title flex items-center gap-2"><HelpCircle /> How to Play</CardTitle>
                            </CardHeader>
                            <CardContent className="body-text text-muted-foreground space-y-4">
                                <p className="font-bold text-center text-foreground">Simply tap the box to open it!</p>
                                <p>Each observation collapses the quantum superposition, revealing a cat that is either <span className="font-bold text-green-500">Alive</span>, <span className="font-bold text-red-500">Dead</span>, or a strange <span className="font-bold text-purple-500">Paradox</span>. Each reveal also comes with a unique message from a feline oracle.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="schrodinger">
                        <Card>
                            <CardHeader>
                                <CardTitle className="section-title flex items-center gap-2"><Cat /> Schrödinger</CardTitle>
                            </CardHeader>
                            <CardContent className="body-text text-muted-foreground space-y-4">
                                <p>This app is a playful exploration of the famous Schrödinger&apos;s Cat thought experiment.</p>
                                {/* Placeholder for the video */}
                                <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                                    <p>MP4 Video Placeholder</p>
                                </div>
                                <a href="https://en.wikipedia.org/wiki/Schr%C3%B6dinger%27s_cat" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4" />
                                    Learn more on Wikipedia
                                </a>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="about">
                        <Card>
                            <CardHeader>
                                <CardTitle className="section-title flex items-center gap-2"><Info /> About</CardTitle>
                            </CardHeader>
                            <CardContent className="body-text text-muted-foreground space-y-2">
                                <p className="font-bold text-foreground">The Quantum Cat</p>
                                <p>Version 3.1</p>
                                <p>Created by FlyBoat Creative 2025</p>
                                <h3 className="font-bold text-foreground mt-4">Credits</h3>
                                <p>Built with Next.js, React, Tailwind CSS, and Genkit.</p>
                                <p>Special thanks to the open-source community.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="feedback">
                        <Card>
                            <CardHeader>
                                <CardTitle className="section-title flex items-center gap-2"><MessageSquare /> Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="body-text">
                                <a href="mailto:hello@thequantumcat.app?subject=Quantum%20Cat%20Contact" className="text-blue-500 hover:underline">Send us an email</a>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
