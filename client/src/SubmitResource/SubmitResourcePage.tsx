/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-props-no-spreading */

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Snackbar,
  TextField,
  Toolbar,
} from '@mui/material';
import { ArrowRight } from '@material-ui/icons';
import PrimaryButton from '../components/buttons/PrimaryButton';
import FormCol from '../components/form/FormCol';
import FormRow from '../components/form/FormRow';
import submit from './api';
import { getData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectFilters } from '../util/redux/filterSlice';

const styles = {
  button: {
    margin: '0 auto',
    display: 'block',
    marginTop: '10px',
    textTransform: 'none',
  },
};

function SubmitResourcePage() {
  const maturityTypes = ['Child', 'Adult'];

  const emp: string[] = [];

  const [masterDisorderObject, setMasterDisorderObject] = useState<any>({});
  const [interventionTypes, setInterventionTypes] = useState([]);
  const [formatTypes, setFormatTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const defaultValues = {
    title: '',
    disorder: emp,
    newDisorder: '',
    keywords: '',
    modifications: '',
    link: '',
    formats: Object.fromEntries(formatTypes.map((i) => [i, false])),
    interventions: Object.fromEntries(interventionTypes.map((i) => [i, false])),
    maturity: Object.fromEntries(maturityTypes.map((i) => [i, false])),
  };

  const filters = useAppSelector(selectFilters);
  const [values, setValueState] = useState(defaultValues);
  const [selectOtherDisorder, setSelectOtherDisorder] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (filters.filters) {
        const resDisorders = filters.filters.Disorder;
        setMasterDisorderObject(resDisorders);
      }

      const resIntervention = await getData('exposure/interventionTypes');
      setInterventionTypes(resIntervention?.data);

      const resFormat = await getData('exposure/formats');
      setFormatTypes(resFormat?.data);

      setIsLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue = (field: string, value: any) => {
    setValueState((prevState) => ({
      ...prevState,
      ...{ [field]: value },
    }));
  };

  const setFormatCheckboxValues = (option: string) => {
    setValueState((prevState) => ({
      ...prevState,
      formats: {
        ...prevState.formats,
        [option]: !prevState.formats[option],
      },
    }));
  };

  const setInterventionCheckboxValues = (option: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      interventions: {
        ...prevState.interventions,
        [option]: !prevState.interventions[option],
      },
    }));
  };

  const setMaturityCheckboxValues = (option: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      maturity: {
        ...prevState.maturity,
        [option]: !prevState.maturity[option],
      },
    }));
  };

  const resolveDisorder = (path: string[]): string[] => {
    let curr = masterDisorderObject;
    path.forEach((ind) => {
      curr = curr[ind];
    });
    return Object.keys(curr);
  };

  const findListHelper = (s: string, o: any, a: any[]) => {
    if (Object.keys(o).filter((it) => it === s).length !== 0) {
      a.push(s);
      return a;
    }

    let l: any = [];

    Object.keys(o).forEach((item: string) => {
      const temp = [...a];
      const t = findListHelper(s, o[item], temp);
      if (t.length > 0) {
        temp.push(item);
        l = temp;
      }
    });

    return l;
  };

  const findList = (s: string) => {
    const tempPath: string[] = [];
    findListHelper(s, masterDisorderObject, tempPath);
    return tempPath;
  };

  const [disordersOpen, setDisordersOpen] = useState(false);
  const [currPath, setCurrPath] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchedDisorders, setSearchedDisorders] = useState<string[]>([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const disorders = resolveDisorder(currPath);

  const submitResourceHelper = async () => {
    const formats = Object.keys(values.formats).filter(
      (format) => values.formats[format],
    );
    const interventions = Object.keys(values.interventions).filter(
      (intervention) => values.interventions[intervention],
    );

    const modifications = selectOtherDisorder
      ? `${values.modifications}\n ADMIN: created new disorder`
      : values.modifications;

    setSelectOtherDisorder(false);
    let keywords: string[] = values.keywords.split(',');
    keywords = keywords.map((str) => str.trim());

    let isSuccess = true;
    const disorder = values.newDisorder
      ? values.newDisorder.split(',').map((str) => str.trim())
      : values.disorder;

    console.log('new disorders');
    console.log(disorder);

    await Promise.all(
      disorder.map(async (d) => {
        const path = findList(d);
        const len = path.length;
        const d1 = len > 0 ? [path[0]] : [];
        const d2 = len > 1 ? [path[1]] : [];
        const d3 = len > 2 ? [path[2]] : [];
        const d4 = len > 3 ? [path[3]] : [];

        try {
          const res = await submit(
            values.title,
            d1,
            d2,
            d3,
            d4,
            formats,
            interventions,
            values.maturity.Adult,
            values.maturity.Child,
            keywords,
            modifications,
            values.link,
          );
        } catch (e) {
          isSuccess = false;
        }
      }),
    );

    return isSuccess;
  };

  const submitResource = async () => {
    const res = await submitResourceHelper();
    if (res) {
      setValueState(defaultValues);
      setSuccessOpen(true);
    } else {
      setSuccessOpen(false);
    }
  };

  const getCurrentList = (p: string[], forDisplay = false) => {
    let tempPath: any = p;
    let tempOptions: any = {};
    Object.assign(tempOptions, masterDisorderObject);
    while (tempPath.length > 0) {
      tempOptions = tempOptions[tempPath[0]];
      tempPath = tempPath.slice(1);
    }
    // TODO: figure out why this doesn't truncate number of keywords displayed
    if (tempOptions.Keyword && forDisplay) {
      tempOptions.Keyword = Object.fromEntries(
        Object.entries(tempOptions.Keyword).slice(0, 5),
      );
    }
    return tempOptions;
  };

  const shiftCategory = (event: any, newOption: any) => {
    event.preventDefault();
    event.stopPropagation();
    const newPath = [...currPath, newOption];
    if (resolveDisorder(newPath).length !== 0) {
      setCurrPath(newPath);
    }
  };

  return (
    <div
      style={{
        marginLeft: '100px',
        marginRight: '100px',
        marginBottom: '10px',
      }}
    >
      <Toolbar />
      {isLoading ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            height: '80vh',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size="60px" />
        </div>
      ) : (
        <div>
          <h2 style={{ fontSize: '50px', fontWeight: 'bold' }}>
            Submit New Resource
          </h2>
          <FormCol>
            <FormRow>
              <Grid item width="1">
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  required
                  label="Title"
                  value={values.title}
                  onChange={(e) => setValue('title', e.target.value)}
                />
              </Grid>
            </FormRow>
            <FormRow>
              <Grid item width="1">
                <Autocomplete
                  disabled={selectOtherDisorder}
                  freeSolo
                  multiple
                  disableCloseOnSelect
                  id="combo-box-demo"
                  options={inputText === '' ? disorders : searchedDisorders}
                  sx={{ width: '100%' }}
                  value={selectOtherDisorder ? [] : values.disorder}
                  onOpen={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDisordersOpen(!disordersOpen);
                    setCurrPath([]);
                  }}
                  renderTags={(_, getTagProps) => {
                    return values.disorder.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        label={option}
                        onDelete={() => {
                          const temp = values.disorder.filter(
                            (item) => item !== option,
                          );
                          setValueState({ ...values, disorder: temp });
                        }}
                      />
                    ));
                  }}
                  onInputChange={(event, inputValue) => {
                    setInputText(inputValue);
                    if (inputValue === '') {
                      setCurrPath([]);
                    } else {
                      const emp: Object[] = [];
                      const flattenedObj = Object.assign(
                        {},
                        ...(function flatten(o: any): Object[] {
                          return emp.concat(
                            ...Object.keys(o).map((k) => {
                              if (typeof o[k] === 'boolean') {
                                return { [k]: 'temp' };
                              }
                              return [...flatten(o[k]), { [k]: 'temp' }];
                            }),
                          );
                        })(getCurrentList([], false)),
                      );
                      const itemsBelow = Object.keys(flattenedObj);
                      setSearchedDisorders(
                        itemsBelow.filter(
                          (it) =>
                            it
                              .toLowerCase()
                              .indexOf(inputValue.toLowerCase()) !== -1,
                        ),
                      );
                    }
                  }}
                  renderOption={(props, option, { selected }) =>
                    inputText === '' ? (
                      resolveDisorder([...currPath, option]).length !== 0 ? (
                        <li
                          style={{
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <li
                            {...props}
                            style={{
                              maxWidth: 'fit-content',
                              padding: 0,
                              display: 'inline-block',
                            }}
                          >
                            <Checkbox
                              checked={selected}
                              onChange={(e) => {
                                let temp = values.disorder;
                                findList(option);
                                if (
                                  temp.filter((item) => item === option)
                                    .length === 0
                                ) {
                                  temp.push(option);
                                } else {
                                  temp = temp.filter((item) => item !== option);
                                }
                                setValueState({
                                  ...values,
                                  disorder: temp,
                                });
                              }}
                            />
                          </li>
                          <button
                            type="button"
                            style={{
                              display: 'inline-block',
                              margin: 0,
                              background: 'none',
                              color: 'inherit',
                              border: 'none',
                              padding: 0,
                              font: 'inherit',
                              cursor: 'pointer',
                              outline: 'inherit',
                              width: '100%',
                            }}
                            onClick={(e) => shiftCategory(e, option)}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              {option}
                              <ArrowRight
                                style={{
                                  width: 25,
                                  height: 25,
                                }}
                              />
                            </div>
                          </button>
                        </li>
                      ) : (
                        <li
                          style={{
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <li
                            {...props}
                            style={{
                              maxWidth: 'fit-content',
                              padding: 0,
                              display: 'inline-block',
                            }}
                          >
                            <Checkbox
                              checked={selected}
                              onChange={(e) => {
                                let temp = values.disorder;
                                findList(option);
                                if (
                                  temp.filter((item) => item === option)
                                    .length === 0
                                ) {
                                  temp.push(option);
                                } else {
                                  temp = temp.filter((item) => item !== option);
                                }
                                setValueState({
                                  ...values,
                                  disorder: temp,
                                });
                              }}
                            />
                          </li>
                          <button
                            type="button"
                            style={{
                              display: 'inline-block',
                              margin: 0,
                              background: 'none',
                              color: 'inherit',
                              border: 'none',
                              padding: 0,
                              font: 'inherit',
                              cursor: 'pointer',
                              outline: 'inherit',
                              width: '100%',
                              textAlign: 'left',
                            }}
                          >
                            {option}
                          </button>
                        </li>
                      )
                    ) : (
                      <li
                        style={{
                          alignItems: 'center',
                          display: 'flex',
                        }}
                      >
                        <li
                          {...props}
                          style={{
                            maxWidth: 'fit-content',
                            padding: 0,
                            display: 'inline-block',
                          }}
                        >
                          <Checkbox
                            checked={selected}
                            onChange={(e) => {
                              let temp = values.disorder;
                              console.log(`temp! ${temp}`);
                              console.log(`e! ${e.target.value}`);
                              if (
                                temp.filter((item) => item === option)
                                  .length === 0
                              ) {
                                temp.push(option);
                              } else {
                                temp = temp.filter((item) => item !== option);
                              }
                              setValueState({
                                ...values,
                                disorder: temp,
                              });
                            }}
                          />
                        </li>
                        <button
                          type="button"
                          style={{
                            display: 'inline-block',
                            margin: 0,
                            background: 'none',
                            color: 'inherit',
                            border: 'none',
                            padding: 0,
                            font: 'inherit',
                            cursor: 'pointer',
                            outline: 'inherit',
                            width: '100%',
                            textAlign: 'left',
                          }}
                        >
                          {option}
                        </button>
                      </li>
                    )
                  }
                  renderInput={(params) => {
                    return <TextField {...params} label="Disorders" />;
                  }}
                />
                <div
                  style={{
                    marginTop: '10px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginRight: '15px',
                    }}
                  >
                    <Checkbox
                      checked={selectOtherDisorder}
                      onChange={() => {
                        setSelectOtherDisorder(!selectOtherDisorder);
                        setValueState({
                          ...values,
                          disorder: [],
                          newDisorder: '',
                        });
                      }}
                      name="select"
                    />
                    <p>Create New Disorder(s)</p>
                  </div>
                  {selectOtherDisorder && (
                    <TextField
                      sx={{ width: '40%' }}
                      size="small"
                      value={values.newDisorder}
                      label="Disorder Title (if multiple, separate by comma)"
                      onChange={(event) => {
                        setValueState({
                          ...values,
                          newDisorder: event.target.value,
                        });
                      }}
                      disabled={!selectOtherDisorder}
                    />
                  )}
                </div>
              </Grid>
            </FormRow>
            <FormRow>
              <Grid item width="0.5">
                <FormControl sx={{ 'padding-left': 0 }}>
                  Format:
                  <FormGroup>
                    {formatTypes.map((option) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.formats[option]}
                            onChange={() => setFormatCheckboxValues(option)}
                            name={option}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item width="0.5">
                <FormControl>
                  Intervention Type:
                  <FormGroup>
                    {interventionTypes.map((option) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.interventions[option]}
                            onChange={(e) =>
                              setInterventionCheckboxValues(
                                option,
                                e.target.value,
                              )
                            }
                            name={option}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Grid>
            </FormRow>
            <FormRow>
              <Grid item width="1">
                <FormControl>
                  Adult/Child Friendly:
                  <FormGroup>
                    {maturityTypes.map((option) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.maturity[option]}
                            onChange={(e) =>
                              setMaturityCheckboxValues(option, e.target.value)
                            }
                            name={option}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Grid>
            </FormRow>
            <FormRow>
              <Grid item width="1">
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  label="Keywords: enter keywords that others might search to find this resource, separated by commas (optional)"
                  value={values.keywords}
                  onChange={(e) => setValue('keywords', e.target.value)}
                />
              </Grid>
            </FormRow>
            <FormRow>
              <Grid item width="1">
                <TextField
                  fullWidth
                  multiline
                  type="text"
                  label="Modifications: enter ways to make this exposure easier or harder (if multiple, separated by commas) (optional)"
                  rows={4}
                  value={values.modifications}
                  onChange={(e) => setValue('modifications', e.target.value)}
                />
              </Grid>
            </FormRow>
            <FormRow>
              <Grid item width="1">
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  label="Link to Resource (optional)"
                  value={values.link}
                  onChange={(e) => setValue('link', e.target.value)}
                />
              </Grid>
            </FormRow>
          </FormCol>
          <Snackbar
            open={successOpen}
            autoHideDuration={6000}
            onClose={() => setSuccessOpen(false)}
          >
            <Alert
              onClose={() => setSuccessOpen(false)}
              severity={successOpen ? 'success' : 'error'}
              sx={{ width: '100%' }}
            >
              {successOpen
                ? 'Successfully submitted resource!'
                : 'Error - please try again'}
            </Alert>
          </Snackbar>
          <Button
            variant="contained"
            sx={styles.button}
            onClick={() => submitResource()}
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}

export default SubmitResourcePage;
