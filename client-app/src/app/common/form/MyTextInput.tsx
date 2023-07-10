import { useField } from 'formik';
import { Form, Input, Label } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    label?: string;
    type?: string;
}

export default function MyTextInput(props: Props) {
    const [field, meta] = useField(props.name);

    return (
        <Form.Field error={meta.touched && !!meta.error} size="big">
            <label>{props.label}</label>
            <Input {...field} {...props} size="large" />
            {meta.touched && meta.error ? (
                <Label basic color="red">
                    {meta.error}
                </Label>
            ) : null}
        </Form.Field>
    );
}
