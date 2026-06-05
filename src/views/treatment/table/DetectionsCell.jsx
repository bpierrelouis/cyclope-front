import { ConfidenceBadge } from '../../../components';

export function DetectionCell(props) {
    const { objects } = props;
    return (
        <div className='flex flex-wrap gap-1'>
            {objects?.map((obj) => (
                <ConfidenceBadge key={obj.type} object={obj} />
            ))}
        </div>
    );
}