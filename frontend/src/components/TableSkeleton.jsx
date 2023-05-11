export default function TableSkeleton() {
    return (
        <div className="loading-table-skeleton-container table-content">
            {[...Array(25)].map((i, index) => {
                return (
                    <div key={index} className="table-row">
                        <span></span>
                    </div>
                )
            })}
        </div>
    );
}