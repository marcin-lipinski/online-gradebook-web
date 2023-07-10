import { Link } from 'react-router-dom';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

export default function SomethingWentWrong() {
    return (
        <Segment className="dashboardcard" textAlign="center">
            <Header as="h2">Coś poszło nie tak</Header>
            <Icon size="big" name="configure"></Icon>
            <Header as="h3">
                Nie martw się, twoje konto nie zostało obciążone
            </Header>
            <Button color="blue" as={Link} to={`/`}>
                Powrót na stronę główną
            </Button>
        </Segment>
    );
}
