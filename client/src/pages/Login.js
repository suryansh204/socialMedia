
import React, { useContext, useState } from "react";
import { Button, Form } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from "../context/auth";

import useForm from "../utils/hooks";

function Login() {
    const [errors, setErrors] = useState({});
    const context = useContext(AuthContext);
    const navigate = useNavigate();

    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        username: '',
        password: ''
    });

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, result) {
            context.login(result.data.login);
            navigate('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values
    })

    function loginUserCallback() {
        loginUser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate loading={loading ? true : false}>
                <h1>Login</h1>
                <Form.Input
                    label='Username'
                    type='text'
                    placeholder='Username...'
                    name='username'
                    value={values.username}
                    onChange={onChange}
                    error={errors && (errors.username ? true : false)}
                />
                <Form.Input
                    label='Password'
                    type='password'
                    placeholder='Password...'
                    name='password'
                    value={values.password}
                    onChange={onChange}
                    error={errors && (errors.password ? true : false)}
                />
                <Button type='submit' primary>Login</Button>
            </Form>

            {errors && (Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            ))}

        </div>
    )
}

const LOGIN_USER = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            id
            username
            email
            createdAt
            token
        }
    }
`

export default Login;
