'use client';

import Image from 'next/image';
import { Award, Flame, Fish } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CatDisplay } from '@/components/cats/CatDisplay';
import { BoxIcon, CarbonBoxIcon, CardboardBoxIcon } from '@/components/icons';
import { QuantumMessageActions } from '@/components/features/quantum-message-actions';
import { TitleDisplay } from '@/components/title-display';
import { cn } from '@/lib/utils';
import type { CatState } from '@/lib/types';

const LIGHT_THEME_COLORS = [
  { name: 'Background', token: '--background', hex: '#F3EEFF' },
  { name: 'Foreground', token: '--foreground', hex: '#382957' },
  { name: 'Card', token: '--card', hex: '#F3EEFF' },
  { name: 'Card Foreground', token: '--card-foreground', hex: '#382957' },
  { name: 'Popover', token: '--popover', hex: '#F8F4FF' },
  { name: 'Popover Foreground', token: '--popover-foreground', hex: '#382957' },
  { name: 'Primary', token: '--primary', hex: '#8D52F6' },
  { name: 'Primary Foreground', token: '--primary-foreground', hex: '#FFFFFF' },
  { name: 'Secondary', token: '--secondary', hex: '#F9C0D3' },
  { name: 'Secondary Foreground', token: '--secondary-foreground', hex: '#73314F' },
  { name: 'Muted', token: '--muted', hex: '#F7D9B9' },
  { name: 'Muted Foreground', token: '--muted-foreground', hex: '#8D52F6' },
  { name: 'Accent', token: '--accent', hex: '#F8A04B' },
  { name: 'Accent Foreground', token: '--accent-foreground', hex: '#9C511C' },
  { name: 'Border', token: '--border', hex: '#C1B2E4' },
  { name: 'Input', token: '--input', hex: '#C1B2E4' },
  { name: 'Ring', token: '--ring', hex: '#8D52F6' },
  { name: 'Destructive', token: '--destructive', hex: '#F04438' },
  { name: 'Destructive Foreground', token: '--destructive-foreground', hex: '#FAFAFA' },
  { name: 'Chart 1', token: '--chart-1', hex: '#8D52F6' },
  { name: 'Chart 2', token: '--chart-2', hex: '#54C96F' },
  { name: 'Chart 3', token: '--chart-3', hex: '#F98DBD' },
  { name: 'Chart 4', token: '--chart-4', hex: '#F0A352' },
  { name: 'Chart 5', token: '--chart-5', hex: '#6D61B0' },
];

const DARK_THEME_COLORS = [
  { name: 'Background', token: '--background', hex: '#0F172A' },
  { name: 'Foreground', token: '--foreground', hex: '#E2E8F0' },
  { name: 'Card', token: '--card', hex: '#141B2C' },
  { name: 'Card Foreground', token: '--card-foreground', hex: '#E2E8F0' },
  { name: 'Popover', token: '--popover', hex: '#141B2C' },
  { name: 'Popover Foreground', token: '--popover-foreground', hex: '#E2E8F0' },
  { name: 'Primary', token: '--primary', hex: '#B57AFA' },
  { name: 'Primary Foreground', token: '--primary-foreground', hex: '#FFFFFF' },
  { name: 'Secondary', token: '--secondary', hex: '#F0643C' },
  { name: 'Secondary Foreground', token: '--secondary-foreground', hex: '#FFEDE3' },
  { name: 'Muted', token: '--muted', hex: '#1F2638' },
  { name: 'Muted Foreground', token: '--muted-foreground', hex: '#95A3C0' },
  { name: 'Accent', token: '--accent', hex: '#F07A32' },
  { name: 'Accent Foreground', token: '--accent-foreground', hex: '#FDE4C7' },
  { name: 'Border', token: '--border', hex: '#323B52' },
  { name: 'Input', token: '--input', hex: '#323B52' },
  { name: 'Ring', token: '--ring', hex: '#B57AFA' },
  { name: 'Destructive', token: '--destructive', hex: '#D6362F' },
  { name: 'Destructive Foreground', token: '--destructive-foreground', hex: '#FAFAFA' },
  { name: 'Chart 1', token: '--chart-1', hex: '#B57AFA' },
  { name: 'Chart 2', token: '--chart-2', hex: '#4BB8A1' },
  { name: 'Chart 3', token: '--chart-3', hex: '#F0643C' },
  { name: 'Chart 4', token: '--chart-4', hex: '#4695D7' },
  { name: 'Chart 5', token: '--chart-5', hex: '#F2BB33' },
];

const TYPOGRAPHY_SAMPLES = [
  { label: 'Headline / H1', className: 'font-headline text-5xl' },
  { label: 'Headline / H2', className: 'font-headline text-4xl' },
  { label: 'Title / H3', className: 'font-headline text-3xl' },
  { label: 'Subtitle', className: 'font-headline text-2xl text-muted-foreground' },
  { label: 'Body / Base', className: 'font-body text-base' },
  { label: 'Body / Small', className: 'font-body text-sm text-muted-foreground' },
  { label: 'Caption', className: 'font-body text-xs uppercase tracking-[0.28em] text-muted-foreground' },
];

const SAMPLE_CAT_STATES: CatState[] = [
  { outcome: 'alive', catId: 'ginger' },
  { outcome: 'alive', catId: 'shark' },
  { outcome: 'paradox', catId: 'paradox' },
];

const BOX_SKINS = [
  { name: 'Quantum Box', component: BoxIcon },
  { name: 'Carbon Box', component: CarbonBoxIcon },
  { name: 'Cardboard Box', component: CardboardBoxIcon },
];

const SAMPLE_MESSAGE = 'Today the Quantum Box hums with possibility. Follow the shimmering thread and see where it leads you!';
const SAMPLE_PRIMARY_CAT: CatState = { outcome: 'alive', catId: 'ginger' };

const HEADER_METRICS = [
  { icon: Award, label: 'Badges unlocked', value: 12, iconClass: 'text-yellow-500' },
  { icon: Flame, label: 'Daily streak', value: 7, iconClass: 'text-red-500' },
  { icon: Fish, label: 'Fish points', value: 420, iconClass: 'text-sky-500' },
] as const;

const USER_STATUS_BASE = 'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide';
const USER_STATUS_GUEST = `${USER_STATUS_BASE} border-border text-[#8D52F6]`;
const USER_STATUS_SIGNED = `${USER_STATUS_BASE} border-transparent bg-[#F2BB33] text-[#1F1404]`;

export default function DesignNStylePage() {
  return (
    <main className="min-h-screen bg-background px-12 py-16">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-16">
        <header className="flex flex-col gap-4 border-b pb-8">
          <Badge className="w-fit bg-primary text-primary-foreground">DesignNStyle</Badge>
          <h1 className="font-headline text-5xl tracking-tight text-foreground">The Quantum Cat Design System</h1>
          <p className="max-w-3xl font-body text-lg text-muted-foreground">
            A live catalog of typography, color, UI, and domain components used across the Quantum Cat universe.
            Every specimen references the production component so visual changes stay consistent.
          </p>
        </header>

        <section className="rounded-[32px] border border-border/50 bg-card/95 px-10 py-12 shadow-[0_25px_70px_-35px_rgba(79,70,229,0.45)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              {HEADER_METRICS.map(({ icon: Icon, value, label, iconClass }) => (
                <div key={label} className="flex items-center gap-1 text-sm font-semibold">
                  <Icon className={cn('h-4 w-4', iconClass)} />
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <span className={cn(USER_STATUS_GUEST, 'self-end sm:self-center')}>Guest</span>
          </div>

          <div className="flex flex-col items-center gap-6 text-center">
            <TitleDisplay name="Ginger Cat" onTitleClick={() => {}} reduceMotion />
            <p className="font-body text-sm text-muted-foreground">TitleDisplay component</p>

            <div className="relative mt-4 flex h-64 w-full max-w-xl items-center justify-center">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 blur-3xl" />
              <div className="relative flex h-56 w-56 items-center justify-center">
                <BoxIcon className="h-full w-full" isOpen />
                <div className="absolute inset-0 flex items-end justify-center">
                  <div className="h-full w-full translate-y-[25%] scale-[0.6]">
                    <CatDisplay state={SAMPLE_PRIMARY_CAT} />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-2xl">
              <div className="rounded-xl bg-muted/50 p-5 text-center shadow-inner">
                <p className="font-fortune text-lg font-semibold leading-relaxed text-primary">
                  {SAMPLE_MESSAGE}
                </p>
              </div>
              <p className="mt-2 text-right font-body text-xs uppercase tracking-[0.25em] text-muted-foreground">
                QuantumMessageDisplay
              </p>
            </div>

            <QuantumMessageActions
              onToggleDiaryEntry={() => {} }
              onShareQuantumMessage={() => {} }
              onRequestAnotherQuantumBox={() => {} }
              isDiarySaved={false}
              hasSharedQuantumMessage={false}
              reduceMotion
            />
            <p className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground">
              QuantumMessageActions
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="border-2 border-dashed border-muted-foreground/20 p-8">
            <h2 className="font-headline text-2xl text-foreground">Typography</h2>
            <div className="mt-6 flex flex-col gap-6">
              {TYPOGRAPHY_SAMPLES.map(sample => (
                <div key={sample.label} className="flex flex-col gap-1">
                  <span className={cn(sample.className, 'text-foreground')}>{sample.label}</span>
                  <span className="font-body text-xs uppercase tracking-[0.32em] text-muted-foreground">Font token</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-2 border-dashed border-muted-foreground/20 p-8">
            <h2 className="font-headline text-2xl text-foreground">Light Theme Palette</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {LIGHT_THEME_COLORS.map(color => (
                <div key={color.token} className="flex flex-col items-start gap-3 rounded-xl border border-muted p-4">
                  <div className="h-16 w-full rounded-md" style={{ backgroundColor: color.hex }} />
                  <div className="flex flex-col">
                    <span className="font-headline text-sm text-foreground">{color.name}</span>
                    <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {color.hex} · {color.token}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-2 border-dashed border-muted-foreground/20 p-8">
            <h2 className="font-headline text-2xl text-foreground">Dark Theme Palette</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {DARK_THEME_COLORS.map(color => (
                <div key={color.token} className="flex flex-col items-start gap-3 rounded-xl border border-muted p-4">
                  <div className="h-16 w-full rounded-md" style={{ backgroundColor: color.hex }} />
                  <div className="flex flex-col">
                    <span className="font-headline text-sm text-foreground">{color.name}</span>
                    <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {color.hex} · {color.token}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-headline text-3xl text-foreground">Interactive Elements</h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="border-2 border-dashed border-muted-foreground/20 p-8">
              <h3 className="font-headline text-xl text-foreground">Primary Actions</h3>
              <div className="mt-6 flex flex-col gap-6">
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-primary text-primary-foreground">
                    Quantum Box Primary
                  </Button>
                  <Button variant="outline" className="border-primary text-primary">
                    Outline Action
                  </Button>
                  <Button variant="secondary">Secondary Action</Button>
                </div>

                <div className="rounded-xl border border-dashed border-muted-foreground/40 p-6">
                  <p className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
                    QuantumMessageActions (from home screen)
                  </p>
                  <QuantumMessageActions
                    onToggleDiaryEntry={() => {}}
                    onShareQuantumMessage={() => {}}
                    onRequestAnotherQuantumBox={() => {}}
                    isDiarySaved={false}
                    hasSharedQuantumMessage={false}
                    reduceMotion
                  />
                </div>
              </div>
            </Card>

            <Card className="border-2 border-dashed border-muted-foreground/20 p-8">
              <h3 className="font-headline text-xl text-foreground">Badges & Labels</h3>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Badge>Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  Tag
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Pill
                </span>
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">User status labels</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={USER_STATUS_GUEST}>Guest</span>
                  <span className={USER_STATUS_SIGNED}>Nova</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="border-2 border-dashed border-muted-foreground/20 p-8">
            <h3 className="font-headline text-xl text-foreground">Forms & Inputs</h3>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <Label htmlFor="design-input">Input</Label>
                <Input id="design-input" placeholder="Input" />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="design-textarea">Textarea</Label>
                <Textarea id="design-textarea" placeholder="Textarea" />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Switch</Label>
                <div className="flex items-center gap-3">
                  <Switch id="design-switch" defaultChecked />
                  <span className="text-sm text-muted-foreground">Switch</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Select</Label>
                <Select defaultValue="option-1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option-1">Select Option</SelectItem>
                    <SelectItem value="option-2">Another Option</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="border-2 border-dashed border-muted-foreground/20 p-8">
            <h3 className="font-headline text-xl text-foreground">Tabs (Gallery layout)</h3>
            <p className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground">src/app/(app)/gallery/page.tsx</p>
            <Tabs defaultValue="Alive" className="mt-6 w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/40 p-1 text-[11px] font-semibold uppercase tracking-wide">
                <TabsTrigger value="Alive" className="px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground">
                  Alive
                </TabsTrigger>
                <TabsTrigger value="Dead" className="px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground">
                  Dead
                </TabsTrigger>
                <TabsTrigger value="Paradox" className="px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground">
                  Paradox
                </TabsTrigger>
              </TabsList>
              <TabsContent value="Alive" className="mt-4 font-body text-sm text-muted-foreground">
                Tabs content placeholder
              </TabsContent>
              <TabsContent value="Dead" className="mt-4 font-body text-sm text-muted-foreground">
                Tabs content placeholder
              </TabsContent>
              <TabsContent value="Paradox" className="mt-4 font-body text-sm text-muted-foreground">
                Tabs content placeholder
              </TabsContent>
            </Tabs>
          </Card>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-headline text-3xl text-foreground">Domain Elements</h2>
          <Card className="border-2 border-dashed border-muted-foreground/20 p-8">
            <h3 className="font-headline text-xl text-foreground">Quantum Cats</h3>
            <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
              {SAMPLE_CAT_STATES.map(catState => (
                <div key={catState.catId} className="flex flex-col items-center gap-4 text-center">
                  <div className="relative flex h-48 w-48 items-end justify-center">
                    <CatDisplay state={catState} />
                  </div>
                  <p className="font-body text-sm uppercase tracking-[0.28em] text-muted-foreground">{catState.catId}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-2 border-dashed border-muted-foreground/20 p-8">
            <h3 className="font-headline text-xl text-foreground">Quantum Boxes</h3>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
              {BOX_SKINS.map(({ name, component: Component }) => (
                <div key={name} className="flex flex-col items-center gap-4 text-center">
                  <Component className="h-40 w-40" isOpen />
                  <span className="font-body text-sm uppercase tracking-[0.28em] text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-2 border-dashed border-muted-foreground/20 p-8">
            <h3 className="font-headline text-xl text-foreground">Logos & Icons</h3>
            <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center gap-3">
                <Image src="/favicon.svg" alt="Logo" width={80} height={80} className="h-16 w-16" />
                <span className="font-body text-xs uppercase tracking-[0.28em] text-muted-foreground">Primary Logo</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <BoxIcon className="h-16 w-16" />
                <span className="font-body text-xs uppercase tracking-[0.28em] text-muted-foreground">Box Icon</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <CarbonBoxIcon className="h-16 w-16" />
                <span className="font-body text-xs uppercase tracking-[0.28em] text-muted-foreground">Carbon Icon</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <CardboardBoxIcon className="h-16 w-16" />
                <span className="font-body text-xs uppercase tracking-[0.28em] text-muted-foreground">Cardboard Icon</span>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
