import React, { useState, useContext } from "react";
import { Modal, Form, Button } from "semantic-ui-react";
import { gql, useMutation } from '@apollo/client';

import useForm from "../utils/hooks";
import { ThemeContext } from "../App";


function EditButtonMultiple({ postId, body, profileId, className, header }) {
    const { theme } = useContext(ThemeContext);
    const [open, setOpen] = useState(false);

    const isDarkTheme = theme === 'dark';

    const { onChange, onSubmit, values } = useForm(editCallback, {
        phone: body.phone,
        email: body.email,
        birthDate: body.birthDate
    })

    const [editProfile] = useMutation(EDIT_MULTIPLE_PROFILE_MUTATION, {
        update() {
            setOpen(false);
        },
        variables: { postId, profileId, phone: values.phone, email: values.email, birthDate: values.birthDate }
    })

    function editCallback() {
        editProfile();
    }

    return (
        <Modal
            basic={isDarkTheme}
            as={Form}
            onSubmit={onSubmit}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size='tiny'
            trigger={
                <Button
                    inverted={isDarkTheme}
                    className={className}
                    size='tiny'
                    color='blue'
                    icon='pencil'
                    circular />}
        >
            {/* Header */}
            <Modal.Header className='modal-components' content={header} />

            {/* Content */}
            <Modal.Content className='modal-components'>
                <Form as='div' inverted={isDarkTheme}>
                    <Form.Field>
                        <Form.Input label='Phone' type='text' name='phone' onChange={onChange} value={values.phone} />
                        <Form.Input label='Email' type='text' name='email' onChange={onChange} value={values.email} />
                        <Form.Input label='Date of Birth' type='text' name='birthDate' onChange={onChange} value={values.birthDate} />
                    </Form.Field>
                </Form>
            </Modal.Content>

            {/* Actions */}
            <Modal.Actions className='modal-components'>
                <Button inverted={isDarkTheme} color="grey" icon="times" content="Cancel" onClick={() => setOpen(false)} />
                <Button inverted={isDarkTheme} type="submit" color="blue" icon="save" content="Save" />
            </Modal.Actions>

        </Modal>
    );
}

const EDIT_MULTIPLE_PROFILE_MUTATION = gql`
    mutation editMultipleProfile($profileId: ID!, $phone: String!, $email: String!, $birthDate: String!) {
        editMultipleProfile(profileId: $profileId, phone: $phone, email: $email, birthDate: $birthDate) {
            id
            username
            email
            phone
            school
            location
            bio
            birthDate
            relationship
        }
    }
`

export default EditButtonMultiple