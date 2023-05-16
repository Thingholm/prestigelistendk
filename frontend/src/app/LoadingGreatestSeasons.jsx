import TableSkeleton from "@/components/TableSkeleton";

export default function LoadingGreatestSeasons() {
    return (
        <div className="greatest-seasons-container">
            <h3>Største individuelle sæsoner</h3>
            <div className="rounded-table-container">
                <div className="table">
                    <div className="table-header">
                        <p>Nr.</p>
                        <p>Rytter</p>
                        <p>Resultater</p>
                        <p>Sæson</p>
                        <p>Point opnået</p>
                    </div>
                    <TableSkeleton />
                </div>
            </div>
        </div>
    )
}