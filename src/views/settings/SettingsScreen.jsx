import { BaseMapSettings } from './BaseMapSettings';
import { DefaultTreatmentSettings } from './DefaultTreatmentSettings';
import { DetectionCategoriesSettings } from './DetectionCategoriesSettings';

export function SettingsScreen() {
    return (
        <main className='flex flex-wrap gap-4 p-4 w-full h-screen overflow-y-auto'>
            <DefaultTreatmentSettings />
            <DetectionCategoriesSettings />
            <BaseMapSettings />
        </main>
    );
}
