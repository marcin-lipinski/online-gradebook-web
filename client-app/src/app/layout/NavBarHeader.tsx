import { MenuItem, Image, Header } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

interface Props {
    userStore: any;
}

export default observer(function NavBarHeader({ userStore }: Props) {
    return (
        <MenuItem className="pol" style={{ marginBottom: '10px' }}>
            <MenuItem>
                <Image
                    style={{ width: '90%', height: 'auto', marginBottom: 15 }}
                    src="assets/logo.png"
                    alt="logo"
                    centered
                />
                <Header inverted as="h2" content="Perkins" textAlign="center" />
                <hr></hr>
                <Header
                    as="h3"
                    textAlign="center"
                    style={{ marginTop: '0', marginBottom: '0px' }}
                    inverted
                    content={`${
                        userStore.user!.name + ' ' + userStore.user!.surname
                    }`}
                />
                <Header
                    as="h4"
                    textAlign="center"
                    style={{ marginTop: '0' }}
                    inverted
                    content={`${userStore.userTypeAsString()}`}
                />
            </MenuItem>
        </MenuItem>
    );
});
