import React, { useState, useEffect } from 'react';
import {
	AuthContainer,
	AuthWrapper,
	StyledAuthDescription,
	StyledAuthHeader,
	StyledAuthLogo,
	StyledButton,
	StyledError,
	StyledFogotPassword,
	StyledForm,
	StyledFormControl,
	StyledFormGroup,
	StyledFormLabel,
	StyledGoogleButton,
	StyledGoogleIcon,
	StyledLink,
	StyledOption,
	StyledSuccess,
} from '../styled';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SetNewPassword = () => {
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [searchParams] = useSearchParams();

	const [formData, setFormData] = useState({
		Email: searchParams.get('param2') || '',
		Password: '',
		ConfirmPassword: '',
		Token: searchParams.get('param1') || '',
	});

	useEffect(() => {
		// Aktualizacja formData przy zmianie parametrów URL
		setFormData((prevFormData) => ({
			...prevFormData,
			Email: searchParams.get('param2') || '',
			Token: searchParams.get('param1') || '',
		}));
	}, [searchParams]);

	const navigate = useNavigate();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (formData.Password !== formData.ConfirmPassword) {
			setErrorMsg("Passwords aren't the same");
			return;
		}

		try {
			const response = await fetch(
				`https://localhost:7247/api/Authentication/reset-password`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
				}
			);

			const obj = await response.json();

			if (response.ok) {
				setErrorMsg('');
				setSuccessMsg(obj.message);
				setTimeout(() => navigate('/login'), 5000);
			} else {
				setSuccessMsg('');
				setErrorMsg(obj.message);
			}
		} catch (error) {
			setErrorMsg('An unexpected error occurred. Please try again.');
		}
	};

	return (
		<AuthContainer>
			<AuthWrapper>
				<StyledAuthLogo>Elaborate</StyledAuthLogo>
				<StyledAuthHeader>New Password</StyledAuthHeader>
				<StyledAuthDescription>Enter your new password.</StyledAuthDescription>
				<StyledForm onSubmit={handleResetPassword}>
					<StyledFormGroup controlId='password'>
						<StyledFormLabel>New password</StyledFormLabel>
						<StyledFormControl
							type='password'
							name='Password'
							placeholder='********'
							value={formData.Password}
							onChange={handleInputChange}
							required
						/>
						<StyledFormLabel>Confirm Password</StyledFormLabel>
						<StyledFormControl
							type='password'
							name='ConfirmPassword'
							placeholder='********'
							value={formData.ConfirmPassword}
							onChange={handleInputChange}
							required
						/>
					</StyledFormGroup>

					{errorMsg && <StyledError> {errorMsg} </StyledError>}
					{successMsg && <StyledSuccess> {successMsg} </StyledSuccess>}

					<StyledButton variant='success' type='submit'>
						Set new password
					</StyledButton>
				</StyledForm>
				<StyledOption>
					<StyledLink onClick={() => navigate('/login')}>
						Back to login
					</StyledLink>
				</StyledOption>
			</AuthWrapper>
		</AuthContainer>
	);
};

export default SetNewPassword;
