import { DefaultTreatmentSettings } from './DefaultTreatmentSettings';
import { DetectionCategoriesSettings } from './DetectionCategoriesSettings';

export function SettingsScreen() {
    return (
        <main className='flex flex-col gap-4 m-auto p-4 w-full max-w-3xl'>
            <DefaultTreatmentSettings />
            <DetectionCategoriesSettings />
        </main>
    );
}
