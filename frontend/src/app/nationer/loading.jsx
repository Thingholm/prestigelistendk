import TableSkeleton from "@/components/TableSkeleton";

export default function NationsRankingLoading() {
    return (
        <div className="nation-table-wrapper loading-ui-container">
            <div className="nation-ranking-table-filter-container">
                <div className="sort-container">
                    <p>Rangér efter:</p>
                    <div className="sort-options-container">
                        <div className="sort-option">
                            <input
                                type="radio"
                                name="nation-sort-radio"
                                id="nation-sort-by-points"
                                checked={true}
                                disabled={true}
                            />
                            <label htmlFor="nation-sort-by-points">Point</label>
                        </div>

                        <div className="sort-option">
                            <input
                                type="radio"
                                name="nation-sort-radio"
                                id="nation-sort-by-points-per-rider"
                                disabled={true}
                            />
                            <label htmlFor="nation-sort-by-points-per-rider">Point per rytter</label>
                        </div>

                        <div className="sort-option">
                            <input
                                type="radio"
                                name="nation-sort-radio"
                                id="nation-sort-by-number-of-riders"
                                disabled={true}
                            />
                            <label htmlFor="nation-sort-by-number-of-riders">Antal ryttere</label>
                        </div>
                    </div>
                </div>

                <div className="filter-container">
                    <p>Filtrér:</p>
                    <div className="filter-options-container">
                        <div className="filter-option">
                            <input
                                type="radio"
                                name="nation-filter-radio"
                                id="nation-filter-all"
                                checked={true}
                                disabled={true}
                            />
                            <label htmlFor="nation-filter-all">Alle ryttere</label>
                        </div>

                        <div className="filter-option">
                            <input
                                type="radio"
                                name="nation-filter-radio"
                                id="nation-filter-active"
                                disabled={true}
                            />
                            <label htmlFor="nation-filter-active">Aktive ryttere</label>
                        </div>

                        <div className="filter-option">
                            <input
                                type="radio"
                                name="nation-filter-radio"
                                id="nation-filter-inactive"
                                disabled={true}
                            />
                            <label htmlFor="nation-filter-inactive">Inaktive ryttere</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table">
                <div className="table-header">
                    <p>Nr.</p>
                    <p>Point</p>
                    <p>Nation</p>
                    <p>Største ryttere</p>
                    <p>Point per rytter</p>
                    <p>Antal ryttere</p>
                </div>
                <div className="table-content">
                    <TableSkeleton />
                </div>
            </div>
        </div>
    );
}