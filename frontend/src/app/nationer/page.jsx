import "flag-icons/css/flag-icons.min.css";
import NationRankingTable from "./NationRankingTable";
import NationsRankingEvolution from "./NationsRankingEvolution";

export default async function Page({ searchParams }) {

    return (
        <div>
            <NationRankingTable searchParams={searchParams} />

            <NationsRankingEvolution />
        </div>
    );
}