import { Button, Header, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';

interface Props {
    subjectId: string;
}

export default observer(function DeleteSubject({ subjectId }: Props) {
    const { modalStore, subjectStore } = useStore();
    const { deleteSubject } = subjectStore;

    const deleteSubjectAndClose = async () => {
        modalStore.closeModal();
        await deleteSubject(subjectId);
    };

    if (subjectStore.loading)
        return <LoadingComponent content="Trwa usuwanie przedmiotu..." />;

    return (
        <>
            <Header textAlign="center">Usunąć ten przedmiot?</Header>
            <Table style={{border: "none"}}>
                <Table.Row>
                    <Table.Cell textAlign='center' width={6}>
                        <Button className='confirm-button' onClick={() => deleteSubjectAndClose()}>Tak</Button>
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
