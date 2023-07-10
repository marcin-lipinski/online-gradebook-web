import { Button, Header, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';

interface Props {
    parentId: string;
}

export default observer(function DeleteParent({ parentId }: Props) {
    const { modalStore, parentsStore } = useStore();
    const { deleteParent } = parentsStore;

    function deleteParentAndClose() {
        modalStore.closeModal();
        deleteParent(parentId);
    }

    if (parentsStore.loading)
        return <LoadingComponent content="Trwa usuwanie rodzica..." />;

    return (
        <>
            <Header textAlign="center">Usunąć tego rodzica?</Header>
            <Table style={{border: "none"}}>
                <Table.Row>
                    <Table.Cell textAlign='center' width={6}>
                        <Button className='confirm-button' onClick={() => deleteParentAndClose()}>Tak</Button>
                    </Table.Cell>
                    <Table.Cell width={1}></Table.Cell>
                    <Table.Cell textAlign='center' width={6}>
                        <Button className='remove-button' onClick={() => modalStore.closeModal()}>Nie</Button>
                    </Table.Cell>
                </Table.Row>
            </Table>
        </>
    );
});
