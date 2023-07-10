import { useField } from 'formik';
import { Form, Label, Select } from 'semantic-ui-react';
import { useEffect} from 'react';

interface Props {
    placeholder: string;
    name: string;
    options: any;
    label?: string;
    validation?: (pisz: string) => boolean;
    submit?: boolean;
    setSubmit?: (s: boolean) => void
}

export default function MySelectInput(props: Props) {
    const [field, meta, helpers] = useField(props.name);

    useEffect(() => {
    if(props.setSubmit){        
            helpers.setValue(null);
            props.setSubmit(false);
        }
    }, [props.submit])

    return (
        <Form.Field
            error={meta.touched && !!meta.error}
            validate={props.validation}
        >
            <label>{props.label}</label>
            <Select
                clearable
                options={props.options}
                value={field.value || null}
                onChange={(ev, data) => helpers.setValue(data.value)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder}
            />
            {meta.touched && meta.error && props.submit ? (
                <Label basic color="red">
                    {meta.error}
                </Label>
            ) : null}
        </Form.Field>
    );
}
