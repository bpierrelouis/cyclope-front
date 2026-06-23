import { ConfidenceBadges } from './ConfidenceBadges';

export function DetectionCell(props) {
    const { result } = props;

    return (
        <div className='flex flex-wrap gap-1'>
            <ConfidenceBadges result={result} />
        </div>
    );
}
