import { Formik, Form, ErrorMessage } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Button, Label } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function LoginForm() {
    const { userStore } = useStore();

    return (
        <Formik
            initialValues={{ login: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) =>
                userStore
                    .login(values)
                    .catch((error) =>
                        setErrors({ error: 'Invalid login or password' })
                    )
            }
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form
                    className="ui form center aligned middle aligned"
                    onSubmit={handleSubmit}
                    autoComplete="off"
                >
                    <MyTextInput placeholder="Login" name="login" />
                    <MyTextInput
                        placeholder="Password"
                        name="password"
                        type="password"
                    />
                    <ErrorMessage
                        name="error"
                        render={() => (
                            <Label
                                style={{ marginBottom: 10 }}
                                basic
                                color="red"
                                content={errors.error}
                            />
                        )}
                    />
                    <Button
                        loading={isSubmitting}
                        inverted
                        content="Login"
                        type="submit"
                        fluid
                        size="huge"
                    />
                </Form>
            )}
        </Formik>
    );
});
