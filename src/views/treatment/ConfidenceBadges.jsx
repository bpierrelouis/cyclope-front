import { ConfidenceBadge } from '../../components';

export function ConfidenceBadges(props) {
    const { result } = props;

    return (<>
        {result.objects?.map((obj, i) => (
            <ConfidenceBadge
                key={`${result.id}-${i}-${obj.type}`}
                object={obj}
            />
        ))}
    </>);
};
