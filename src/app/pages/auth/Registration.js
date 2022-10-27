import React from "react";
import { Formik, Field, useField, useFormikContext } from "formik";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { Checkbox, FormControlLabel, TextField } from "@material-ui/core";
import * as auth from "../../store/ducks/auth.duck";
import { register } from "../../crud/auth.crud";
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import countryList from 'react-select-country-list'
import axios from "axios";
import { Divider } from "antd";
import * as Yup from 'yup';

const registrationSchema = Yup.object().shape({
  firstname: Yup.string()
    .required('Required'),
  lastname: Yup.string()
    .required('Required'),
  username: Yup.string()
    .required('Required')
    .test('checkUsernameUnique', 'This username is already registered.', value =>
      axios.get(
        process.env.REACT_APP_HOST + "/EuclideV2/api/user/usercheck",
        {
          params: {
            username: value
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
          },
          withCredentials: true,
        }
      )
      .then(res => {
        return res.data.status == 'OK'
      }),
    ),
  email: Yup.string()
    .email('Invalid email')
    .required('Required')
    .test('checkEmailUnique', 'This email is already registered.', value =>
      axios.get(
        process.env.REACT_APP_HOST + "/EuclideV2/api/user/usercheck",
        {
          params: {
            email: value
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
          },
          withCredentials: true,
        }
      )
      .then(res => {
        return res.data.status == 'OK'
      }),
    ),
  password: Yup.string()
    .required('Required'),
  confirmPassword: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const UsernameField = (props) => {
  const {
    values: { firstname, lastname, username },
    touched,
    errors,
    setFieldValue,
  } = useFormikContext();
  const [field, meta] = useField(props);

  React.useEffect(() => {
    if (
      firstname.trim() !== '' &&
      lastname.trim() !== ''
    ) {
      setFieldValue(props.name, `${firstname.toLowerCase().slice(0,1)}${lastname.toLowerCase().replace(/ /g,'')}`);
    }
  }, [firstname, lastname, setFieldValue, props.name]);

  return (
    <TextField                     
      {...props} {...field} 
      margin="none"
      className="kt-width-full"
      value={username}
      helperText={touched.username && errors.username}
      error={Boolean(touched.username && errors.username)}
    />
  );
};

function Registration(props) {
  const { intl } = props;
  const countries = countryList().getData();

  return (
    <div className="kt-login__body">
      <div className="kt-login__form">
        <div className="kt-login__title">
          <h3>
            <FormattedMessage id="AUTH.REGISTER.TITLE" />
          </h3>
        </div>

        <Formik 
          initialValues={{
            firstname: "",
            lastname:"",
            phone: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            company: "",
            npinumber: "",
            address1: "",
            address2: "",
            address3: "",
            city: "",
            state: "",
            postalcode: "",
            country:"",
            acceptTerms: false,
          }}
          validationSchema={registrationSchema}
          onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
            register(values)
              .then((res) => {
                window.scrollTo(0, 0)
                setSubmitting(false);
                if (res.data && res.data.success) {
                  resetForm();
                  setStatus({
                    type: 'success',
                    text: intl.formatMessage({
                      id: "AUTH.REGISTER.SUCCESS"
                    })
                  });
                } else {
                  setStatus({
                    type: 'danger',
                    text: intl.formatMessage({
                      id: "AUTH.VALIDATION.INVALID_LOGIN"
                    })
                  });
                }
                // props.register(accessToken);
              })
              .catch(() => {
                window.scrollTo(0, 0)
                setSubmitting(false);
                setStatus({
                  type: 'danger',
                  text: intl.formatMessage({
                    id: "AUTH.VALIDATION.INVALID_LOGIN"
                  })
                });
              });
          }}
        >
          {({
            values,
            status,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
          }) => (
            <form 
              noValidate={true}
              autoComplete="off"
              className="kt-form"
              onSubmit={handleSubmit}>
              {status && (
                <div role="alert" className={`alert alert-${status.type}`}>
                  <div className="alert-text">{status.text}</div>
                </div>
              )}

              <Divider>Personal details</Divider>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <TextField
                    margin="none"
                    label="Firstname"
                    className="kt-width-full"
                    name="firstname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstname}
                    helperText={touched.firstname && errors.firstname}
                    error={Boolean(touched.firstname && errors.firstname)}
                  />
                </FormControl>
              </div>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <TextField
                    margin="none"
                    label="Lastname"
                    className="kt-width-full"
                    name="lastname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastname}
                    helperText={touched.lastname && errors.lastname}
                    error={Boolean(touched.lastname && errors.lastname)}
                  />
                </FormControl>
              </div>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <TextField
                    margin="none"
                    label="Phone"
                    className="kt-width-full"
                    name="phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    helperText={touched.phone && errors.phone}
                    error={Boolean(touched.phone && errors.phone)}
                  />
                </FormControl>
              </div>

              <Divider>Account details</Divider>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <TextField
                    label="Email"
                    margin="none"
                    className="kt-width-full"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    helperText={touched.email && errors.email}
                    error={Boolean(touched.email && errors.email)}
                  />
                </FormControl>
              </div>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <UsernameField
                    label="Username"
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </FormControl>
              </div>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <TextField
                    type="password"
                    margin="none"
                    label="Password"
                    className="kt-width-full"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    helperText={touched.password && errors.password}
                    error={Boolean(touched.password && errors.password)}
                  />
                </FormControl>
              </div>

              <div className="form-group">
                <FormControl fullWidth={true}>
                  <TextField
                    type="password"
                    margin="none"
                    label="Confirm Password"
                    className="kt-width-full"
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmPassword}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                    error={Boolean(
                      touched.confirmPassword && errors.confirmPassword
                    )}
                  />
                </FormControl>
              </div>

              <Divider>Company details</Divider>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <TextField
                    label="Company"
                    margin="none"
                    className="kt-width-full"
                    name="company"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.company}
                    helperText={touched.company && errors.company}
                    error={Boolean(touched.company && errors.company)}
                  />
                </FormControl>
              </div>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <TextField
                    label="NPI Number"
                    margin="none"
                    className="kt-width-full"
                    name="npinumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.npinumber}
                    helperText={touched.npinumber && errors.npinumber}
                    error={Boolean(touched.npinumber && errors.npinumber)}
                  />
                </FormControl>
              </div>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <TextField
                    label="Address line 1"
                    margin="none"
                    className="kt-width-full"
                    name="address1"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address}
                    helperText={touched.address1 && errors.address1}
                    error={Boolean(touched.address1 && errors.address1)}
                  />
                </FormControl>
              </div>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <TextField
                    label="Address line 2"
                    margin="none"
                    className="kt-width-full"
                    name="address2"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address2}
                    helperText={touched.address2 && errors.address2}
                    error={Boolean(touched.address2 && errors.address2)}
                  />
                </FormControl>
              </div>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <TextField
                    label="Address line 3"
                    margin="none"
                    className="kt-width-full"
                    name="address3"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address3}
                    helperText={touched.address3 && errors.address3}
                    error={Boolean(touched.address3 && errors.address3)}
                  />
                </FormControl>
              </div>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <TextField
                    label="City/Town"
                    margin="none"
                    className="kt-width-full"
                    name="city"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.city}
                    helperText={touched.city && errors.city}
                    error={Boolean(touched.city && errors.city)}
                  />
                </FormControl>
              </div>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <TextField
                    label="State"
                    margin="none"
                    className="kt-width-full"
                    name="state"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.state}
                    helperText={touched.state && errors.state}
                    error={Boolean(touched.state && errors.state)}
                  />
                </FormControl>
              </div>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <TextField
                    label="Postale code"
                    margin="none"
                    className="kt-width-full"
                    name="postalcode"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.postalcode}
                    helperText={touched.postalcode && errors.postalcode}
                    error={Boolean(touched.postalcode && errors.postalcode)}
                  />
                </FormControl>
              </div>

              <div className="form-group mb-0">
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="country-helper">Country</InputLabel>
                  <Field   
                    label="Country"
                    margin="none"
                    name="country"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.country}
                    error={Boolean(touched.country && errors.country)}
                    input={<Input name="country" id="country-helper" />}
                    placeholder="Select your country" options={countries} component={Select}>
                      {countries.map(country => <MenuItem key={country.value} value={country.value}>{country.label}</MenuItem>)}
                    </Field>
                </FormControl>
              </div>

              <div className="form-group mb-0">
                <FormControlLabel
                  label={
                    <>
                      I agree the{" "}
                      <Link
                        to="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms & Conditions
                      </Link>
                    </>
                  }
                  control={ 
                    <Field   
                      color="primary"
                      label="acceptTerms"
                      margin="none"
                      id="acceptTerms"
                      name="acceptTerms"
                      onChange={handleChange}
                      checked={values.acceptTerms}
                      component={Checkbox}/>
                  }
                />
              </div>

              <div className="kt-login__actions">
                <Link
                  to="/auth/forgot-password"
                  className="kt-link kt-login__link-forgot"
                >
                  <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
                </Link>

                <Link to="/auth">
                  <button type="button" className="btn btn-secondary btn-elevate kt-login__btn-secondary">
                    Back
                  </button>
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting || !values.acceptTerms}
                  className="btn btn-primary btn-elevate kt-login__btn-primary"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default injectIntl(
  connect(
    null,
    auth.actions
  )(Registration)
);
