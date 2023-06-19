import SectionLinkButton from "@/components/SectionLinkButton";
import TableSkeleton from "@/components/TableSkeleton";
import { baseUrl } from "@/utils/baseUrl";

export default function LoadingGreatestSeasons() {
    return (
        <div className="greatest-seasons-container" id="stoerste-saesoner">
            <h3>Største individuelle sæsoner <SectionLinkButton link={baseUrl + "/#stoerste-saesoner"} sectionName={"Største individuelle sæsoner"} /></h3>
            <div className="rounded-table-container">
                <div className="table">
                    <div className="table-header">
                        <p>Nr.</p>
                        <p>Rytter</p>
                        <p>Største resultater</p>
                        <p>Sæson</p>
                        <p>Point opnået</p>
                    </div>
                    <TableSkeleton />
                </div>
            </div>
        </div>
    )
}