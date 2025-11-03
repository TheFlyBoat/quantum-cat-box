
import { type CatState } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { CatDisplay } from './cat-display';
import { cn } from '@/lib/utils';
import catData from '@/lib/cat-data.json';
import { BoxIcon, CarbonBoxIcon, CardboardBoxIcon } from './icons';
import Image from 'next/image';

type BoxSkin = 'default' | 'shiny' | 'cardboard';

interface ShareCardProps {
  catState: CatState;
  message: string;
  boxSkin: BoxSkin;
}

const allCats = catData.cats as {id: string, name: string, description: string, type: string, points: number, tagline: string}[];

/**
 * A component that displays the share card.
 * @param catState The state of the cat.
 * @param message The message from the cat.
 * @param boxSkin The skin of the box.
 */
export function ShareCard({ catState, message, boxSkin }: ShareCardProps) {
    const cat = allCats.find(c => c.id === catState.catId);

    const gradients: Record<string, string> = {
        'Alive': 'from-green-200 via-teal-100 to-blue-200',
        'Dead': 'from-gray-300 via-gray-200 to-gray-400',
        'Paradox': 'from-purple-200 via-pink-200 to-indigo-300',
        'initial': 'from-gray-100 to-gray-200',
    };

    const gradientClass = cat ? gradients[cat.type] || gradients.initial : gradients.initial;

    let BoxComponent;
    switch (boxSkin) {
        case 'carbon':
        BoxComponent = CarbonBoxIcon;
        break;
        case 'cardboard':
        BoxComponent = CardboardBoxIcon;
        break;
        default:
        BoxComponent = BoxIcon;
        break;
    }

    const catName = cat?.name || "A Cat Appeared!";
    const title = catName.startsWith("The") ? catName : `The ${catName}`;

  return (
    <Card 
        className={cn(
            "w-full h-full relative overflow-hidden flex flex-col p-6 text-center shadow-2xl bg-gradient-to-br font-body",
            gradientClass
        )}
    >
        <div className="flex flex-col items-center justify-between h-full w-full space-y-3">
            {/* Header */}
            <div className="w-full flex flex-col items-center text-foreground/80 space-y-2">
                <Image src="/favicon.svg" alt="The Quantum Cat Logo" width={40} height={40} className="h-10 w-10" />
                <h3
                    className="section-title font-bold tracking-tight text-primary-foreground bg-primary/80 px-3 py-1 rounded-lg shadow-sm"
                >
                    {title}
                </h3>
            </div>
            
            {/* Main Content: Box and Cat */}
            <div className="flex-shrink-0 flex items-center justify-center w-full -mt-4">
                <div className="relative w-48 h-48">
                    <BoxComponent className="w-full h-full" isOpen={true} />
                    <div className="absolute inset-0 flex items-end justify-center">
                        <div className="w-full h-full scale-[0.6] translate-y-[25%]">
                            <CatDisplay state={catState} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Message */}
            <div className="w-full px-2">
                <div className="bg-background/50 rounded-lg p-3 min-h-[6rem] flex items-center justify-center shadow-inner">
                    <p
                        className="body-text font-semibold leading-tight text-foreground/80"
                    >
                        &ldquo;{message}&rdquo;
                    </p>
                </div>
                <p className="text-right text-sm font-semibold text-purple-600 mt-1 pr-2">#thequantumcat</p>
            </div>

            {/* Footer */}
            <div className="text-center font-headline body-text text-primary/80 pt-2">
                thequantumcat.app
            </div>
        </div>
    </Card>
  );
}
