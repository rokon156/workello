interface Segment {
	id: string | number;
	title: string;
	color: string;
	count: number;
}

interface Props {
	segments: Segment[];
}

export default function ListDistributionBar({ segments }: Props) {
	const total = segments.reduce((sum, s) => sum + s.count, 0);

	if (total === 0) {
		return (
			<div className="h-1.5 w-full rounded-full bg-white/5" title="No cards yet" />
		);
	}

	return (
		<div className="flex h-1.5 w-full overflow-hidden rounded-full gap-[1.5px]">
			{segments
				.filter((s) => s.count > 0)
				.map((s) => (
					<div
						key={s.id}
						title={`${s.title}: ${s.count}`}
						style={{
							backgroundColor: s.color,
							width: `${(s.count / total) * 100}%`,
						}}
						className="h-full first:rounded-l-full last:rounded-r-full"
					/>
				))}
		</div>
	);
}
