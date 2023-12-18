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
	StyledGoogleIcon, StyledInputGroup,
	StyledLink,
	StyledOption, StyledPassInputWrapper,
	StyledSuccess, StyledTooltip,
} from '../styled';
import { useNavigate, useSearchParams } from 'react-router-dom';
import validator from "validator";
import {useTranslation} from "react-i18next";
import OpenEyeIcon from "../../../assets/OpenEye/OpenEyeIcon";
import CloseEyeIcon from "../../../assets/CloseEye/CloseEyeIcon";
import {Tooltip} from "react-tooltip";
import {ColorRing} from "react-loader-spinner";

const SetNewPassword = () => {
	const [isPassCorrect, setIsPassCorrect] = useState(false);
	const [showPass, setShowPass] = useState(false);
	const [toggleSpinner, setToggleSpinner] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [searchParams] = useSearchParams();

	const { t } = useTranslation();

	const [formData, setFormData] = useState({
		Email: searchParams.get('param2') || '',
		Password: '',
		ConfirmPassword: '',
		Token: searchParams.get('param1') || '',
	});

	useEffect(() => {
		setFormData((prevFormData) => ({
			...prevFormData,
			Email: searchParams.get('param2') || '',
			Token: searchParams.get('param1') || '',
		}));
	}, [searchParams]);

	const navigate = useNavigate();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		if (/Password/i.test(name)) {
			if (name === 'Password') {
				if (validator.isStrongPassword(value, {
					minLength: 8, minLowercase: 1,
					minUppercase: 1, minNumbers: 1, minSymbols: 1
				})) {
					setErrorMsg('');
					setIsPassCorrect(true);
					setSuccessMsg(t('settings.strongPass'))
				} else {
					setSuccessMsg('');
					setIsPassCorrect(false);
					setErrorMsg(t('settings.weakPass'))
				}
			} else  {
				if (name === 'ConfirmPassword' && formData.Password !== value) {
					setIsPassCorrect(false);
					setSuccessMsg('');
					setErrorMsg(t('settings.diffPass'));
				} else {
					setIsPassCorrect(true);
					setSuccessMsg('');
					setErrorMsg('');
				}
			}

			setFormData((prevData) => ({
				...prevData,
				[name]: value,
			}));
		}

		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setSuccessMsg('');
		setErrorMsg('');

		if (!isPassCorrect) {
			setErrorMsg('Please, check you password');

			return false;
		}

		setToggleSpinner(true);

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
				setToggleSpinner(false);
				setErrorMsg('');
				setSuccessMsg(obj.message);
				setTimeout(() => navigate('/login'), 3e3);
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
					<StyledFormGroup controlId='Password'>
						<StyledFormLabel>
							New password
							<StyledTooltip
								data-tooltip-id="password-tooltip"
								data-tooltip-html={t('settings.tooltip')}
								data-tooltip-place="right">
								?
							</StyledTooltip>
						</StyledFormLabel>
						<StyledPassInputWrapper>
							<StyledFormControl
								type={showPass ? 'text' : 'password'}
								name='Password'
								placeholder='********'
								// value={formData.Password}
								onChange={handleInputChange}
								required
							/>
							<StyledInputGroup id='password' onClick={() => setShowPass(!showPass)} >
								{showPass ? <OpenEyeIcon/> : <CloseEyeIcon/>}
							</StyledInputGroup>
						</StyledPassInputWrapper>
						<Tooltip id="password-tooltip" style={{whiteSpace: 'pre-line'}} />
					</StyledFormGroup>
					<StyledFormGroup controlId='ConfirmPassword'>
						<StyledFormLabel>Confirm Password</StyledFormLabel>
						<StyledPassInputWrapper>
							<StyledFormControl
								type={showPass ? 'text' : 'password'}
								name='ConfirmPassword'
								placeholder='********'
								// value={formData.Password}
								onChange={handleInputChange}
								required
							/>
							<StyledInputGroup id='password' onClick={() => setShowPass(!showPass)} >
								{showPass ? <OpenEyeIcon/> : <CloseEyeIcon/>}
							</StyledInputGroup>
						</StyledPassInputWrapper>
					</StyledFormGroup>

					{errorMsg && <StyledError> {errorMsg} </StyledError>}
					{successMsg && <StyledSuccess> {successMsg} </StyledSuccess>}

					<StyledButton variant='success' type='submit'>
						{ !toggleSpinner
							? 'Set new password'
							: <ColorRing
								visible={true}
								height="40"
								width="40"
								ariaLabel="spinner"
								wrapperStyle={{}}
								wrapperClass="blocks-wrapper"
								colors={['#F4F5F7', '#F4F5F7', '#F4F5F7', '#F4F5F7', '#F4F5F7']}
							/>
						}
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
