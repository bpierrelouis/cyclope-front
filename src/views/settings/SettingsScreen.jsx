import { ProcessImportCarto } from '../../components';
import { DefaultBaseMapCard } from './DefaultBaseMapCard';
import { DefaultTreatmentSettings } from './DefaultTreatmentSettings';
import { DetectionCategoriesCard } from './detectionCatalog/DetectionCategoriesCard';
import { DetectionsCard } from './detectionCatalog/DetectionsCard';

export function SettingsScreen() {
    return (
        <main className='flex lg:grid flex-col lg:grid-rows-2 gap-4 p-4 w-full h-full min-h-0 overflow-y-auto lg:overflow-hidden'>
            <div className='gap-4 grid grid-cols-1 lg:grid-cols-2 items-stretch lg:min-h-0'>
                <div className='flex flex-col gap-4 min-h-0'>
                    <DefaultTreatmentSettings />
                    <DefaultBaseMapCard />
                </div>
                <ProcessImportCarto />
            </div>

            <div className='gap-4 grid grid-cols-1 lg:grid-cols-2 items-stretch lg:min-h-0'>
                <DetectionCategoriesCard />
                <DetectionsCard />
            </div>
        </main>
    );
}
