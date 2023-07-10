import { Link } from 'react-router-dom';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

export default function NotFound() {
    return (
        <Segment className="dashboardcard" textAlign="center">
            <Header as="h2">Nie znaleziono strony</Header>
            <Icon size="big" name="window close"></Icon>
            <br />
            <br />
            <Button color="blue" as={Link} to={`/`}>
                Powrót na stronę główną
            </Button>
        </Segment>
    );
}
