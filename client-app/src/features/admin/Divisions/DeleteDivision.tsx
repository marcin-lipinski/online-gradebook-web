import { Button, Header, Table } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Division } from "../../../app/models/division"
import { useStore } from "../../../app/stores/store";

interface Props {
    division: Division
}

export default function DeleteDivision ({division}: Props) {
    const { modalStore, divisionStore } = useStore();
    const { deleteDivision } = divisionStore;

    function deleteDivisionAndClose() {
        modalStore.closeModal();
        deleteDivision(division.id);
    }

    if (divisionStore.loading) return <LoadingComponent content="Trwa usuwanie klasy..." />;

    return (
        <>
            <Header textAlign="center">Usunąć tę klasę?</Header>
            <Table style={{border: "none"}}>
                <Table.Row>
                    <Table.Cell textAlign='center' width={6}>
                        <Button className='confirm-button' onClick={() => deleteDivisionAndClose()}>Tak</Button>
                    </Table.Cell>
                    <Table.Cell width={1}></Table.Cell>
                    <Table.Cell textAlign='center' width={6}>
                        <Button className='remove-button' onClick={() => modalStore.closeModal()}>Nie</Button>
                    </Table.Cell>
                </Table.Row>
            </Table>
        </>
    );
}