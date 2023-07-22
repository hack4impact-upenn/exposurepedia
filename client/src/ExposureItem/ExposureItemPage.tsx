import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Chip,
  Link,
  Typography,
  Button,
  TextField,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  Cancel,
  FavoriteBorder,
  Favorite,
  AddCircleOutline,
} from '@mui/icons-material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import WarningIcon from '@mui/icons-material/Warning';
import { deleteData, getData, postData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import {
  updateItem,
  approveItem,
  rejectItem,
} from '../components/apis/ExposureApi';
import Popup from '../components/Popup';

interface Item {
  name: string;
  disorders: string[];
  formats: string[];
  interventionTypes: string[];
  isChildAppropriate: boolean;
  isAdultAppropriate: boolean;
  keywords: string[];
  modifications: string;
  maturity: string[];
  link: string;
  updatedAt: string;
}

export default function ExposureItem() {
  const [isEdit, setIsEdit] = useState(false);
  const [liked, setLiked] = useState(false);
  const [numLikes, updateNumLikes] = useState(0);
  const user = useAppSelector(selectUser);
  const email = user?.email?.toLowerCase();
  const [popupState, setPopupState] = useState('');
  const emp: string[] = [];
  const [curItem, setCurItem] = useState({
    name: '',
    disorders: emp,
    formats: emp,
    interventionTypes: emp,
    isChildAppropriate: false,
    isAdultAppropriate: false,
    keywords: emp,
    maturity: emp,
    modifications: '',
    link: '',
    updatedAt: '',
  });
  const [savedItem, setSavedItem] = useState({
    name: '',
    disorders: emp,
    formats: emp,
    interventionTypes: emp,
    isChildAppropriate: false,
    isAdultAppropriate: false,
    keywords: emp,
    maturity: emp,
    modifications: '',
    link: '',
    updatedAt: '',
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  let isBroken = location.state ? location.state.isBroken : false;
  let isApprove = location.state ? location.state.isApprove : false;

  useEffect(() => {
    const fetchData = async () => {
      const res = await getData(`exposure/${id}`);
      const maturity: any = [];
      const updatedAt = new Date(res?.data[0].updatedAt).toLocaleDateString();
      const disorders = res?.data[0].disorders.map((it: any) => it.name);
      const formats = res?.data[0].formats.map((it: any) => it.name);
      const interventionTypes = res?.data[0].interventionTypes.map(
        (it: any) => it.name,
      );
      const keywords = res?.data[0].keywords.map((it: any) => it.name);
      if (res?.data[0].isAdultAppropriate) {
        maturity.push({ name: 'Adult' });
      }
      if (res?.data[0].isChildAppropriate) {
        maturity.push({ name: 'Child' });
      }
      setCurItem({
        ...res?.data[0],
        disorders,
        formats,
        interventionTypes,
        keywords,
        maturity,
        updatedAt,
      });
      setSavedItem({
        ...res?.data[0],
        disorders,
        formats,
        interventionTypes,
        keywords,
        maturity,
      });

      // get likes
      const numLikesRes = await getData(`exposurelikes/${id}`);
      updateNumLikes(numLikesRes.data);

      const likeRes = await postData(`exposurelikes/${id}/${email}`);
      if (likeRes.data.createdLike === false) {
        setLiked(true);
      } else {
        await deleteData(`exposurelikes/${id}/${email}`);
        setLiked(false);
      }
    };
    fetchData();
  }, [email, id]);

  const saveChanges = () => {
    setIsEdit(false);
    setSavedItem(curItem);
    const { isAdultAppropriate } = curItem;
    const { isChildAppropriate } = curItem;
    isBroken = false;
    updateItem(
      id || '',
      curItem.name,
      curItem.disorders,
      curItem.formats,
      curItem.interventionTypes,
      isAdultAppropriate,
      isChildAppropriate,
      isBroken,
      curItem.keywords,
      curItem.modifications,
      curItem.link,
    );
  };

  const approve = () => {
    approveItem(id || '');
    isApprove = false;
    navigate('/approve');
  };

  const reject = () => {
    rejectItem(id || '');
    navigate('/approve');
  };

  const cancelChanges = () => {
    setIsEdit(false);
    setCurItem(savedItem);
  };

  const handleDelete = (key: string, data: string) => {
    setCurItem((prevItem) => {
      const usedKey = key as keyof Item;
      const newsavedItem: Item = JSON.parse(JSON.stringify(prevItem));
      const changedArray: any[] = prevItem[usedKey] as any[];
      return {
        ...newsavedItem,
        [usedKey]: changedArray.filter(
          (changedItem) => changedItem.name !== data && changedItem !== data,
        ),
      };
    });
  };

  return (
    <div>
      <Toolbar />
      {isApprove && (
        <div
          style={{
            width: '100%',
            background: '#f5f5f5',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
            margin: '0px',
            padding: '10px 10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'left',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              padding: '10px 0px',
            }}
          >
            <p style={{ margin: '0px' }}>This resource is awaiting approval</p>
            <div style={{ marginTop: '10px' }}>
              <Button
                variant="outlined"
                sx={{
                  maxWidth: '180px',
                  height: '30px',
                  borderColor: 'green',
                  color: 'green',
                  textTransform: 'none',
                  margin: '0px 5px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.8)',
                }}
                onClick={() => approve()}
              >
                Approve Resource
              </Button>
              <Button
                variant="outlined"
                sx={{
                  maxWidth: '180px',
                  height: '30px',
                  borderColor: 'red',
                  color: 'red',
                  textTransform: 'none',
                  margin: '0px 5px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.8)',
                }}
                onClick={() => reject()}
              >
                Reject Resource
              </Button>
            </div>
          </div>
        </div>
      )}
      {isBroken && (
        <div
          style={{
            width: '100%',
            background: '#f5f5f5',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
            margin: '0px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '10px 0px',
          }}
        >
          <p style={{ margin: '0px', display: 'flex', alignItems: 'center' }}>
            {' '}
            <WarningIcon
              sx={{
                color: '#EDDD4E',
                margin: '0px 5px',
              }}
            />{' '}
            This resource has a broken link
          </p>
          <div style={{ marginTop: '10px' }}>
            <Button
              variant="outlined"
              sx={{
                maxWidth: '180px',
                height: '30px',
                borderColor: 'green',
                color: 'green',
                textTransform: 'none',
                margin: '0px 5px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.8)',
              }}
              onClick={() => saveChanges()}
            >
              Approve Resource
            </Button>
            <Button
              variant="outlined"
              sx={{
                maxWidth: '180px',
                height: '30px',
                borderColor: 'red',
                color: 'red',
                textTransform: 'none',
                margin: '0px 5px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.8)',
              }}
              onClick={() => saveChanges()}
            >
              Reject Resource
            </Button>
          </div>
        </div>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
          margin: '1rem',
          // border: '1px solid #e9e9e9',
          borderRadius: '16px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <div style={{ marginRight: '10px' }}>
              <IconButton
                onClick={() => {
                  return isApprove
                    ? navigate('/approve')
                    : navigate('/exposurepedia');
                }}
              >
                <ArrowBackRoundedIcon
                  sx={{
                    color: 'black',
                  }}
                />
              </IconButton>
            </div>
            <Typography variant="h5" sx={{ mr: '0.25rem' }}>
              {isEdit ? (
                <TextField
                  sx={{ width: '750px' }}
                  InputProps={{
                    style: { fontSize: '24px', fontWeight: 'bold' },
                  }}
                  id="standard-basic"
                  variant="standard"
                  onChange={(e) => {
                    setCurItem((prevItem) => ({
                      ...prevItem,
                      name: e.target.value,
                    }));
                  }}
                  defaultValue={curItem.name}
                />
              ) : (
                <strong style={{ width: '600px' }}>{curItem.name}</strong>
              )}
            </Typography>
            {liked ? (
              <Favorite
                style={{ color: 'CF0C0C' }}
                onClick={async () => {
                  await deleteData(`exposurelikes/${id}/${email}`);
                  setLiked(false);
                  const numLikesRes = await getData(`exposurelikes/${id}`);
                  updateNumLikes(numLikesRes.data);
                }}
              />
            ) : (
              <FavoriteBorder
                style={{ color: 'CF0C0C' }}
                onClick={async () => {
                  await postData(`exposurelikes/${id}/${email}`);
                  setLiked(true);
                  const numLikesRes = await getData(`exposurelikes/${id}`);
                  updateNumLikes(numLikesRes.data);
                }}
              />
            )}
            <Typography color="GrayText">{numLikes}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <Typography>Last updated {curItem.updatedAt}</Typography>
            {user.admin &&
              (isEdit ? (
                <>
                  <Button
                    variant="outlined"
                    sx={{
                      maxWidth: '200px',
                      borderColor: 'green',
                      color: 'green',
                      textTransform: 'none',
                      marginTop: '10px',
                    }}
                    onClick={() => saveChanges()}
                  >
                    <span style={{ marginRight: '5px' }}>Save Changes</span>
                    <CheckIcon />
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      maxWidth: '200x',
                      borderColor: 'gray',
                      color: 'gray',
                      marginTop: '10px',
                      textTransform: 'none',
                    }}
                    onClick={() => cancelChanges()}
                  >
                    <span style={{ marginRight: '5px' }}>Cancel Changes</span>
                    <CheckIcon />
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  sx={{ maxWidth: '140px', marginTop: '10px' }}
                  onClick={() => setIsEdit(true)}
                >
                  <span style={{ marginRight: '5px' }}>Edit Item</span>
                  <EditIcon />
                </Button>
              ))}
          </Box>
        </Box>
        {[
          'disorders',
          'formats',
          'interventionTypes',
          'maturity',
          'keywords',
        ].map((key) => {
          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                my: '0.25rem',
                mx: '3.25rem',
              }}
            >
              <Typography>
                <strong style={{ marginRight: '5px' }}>
                  {key.charAt(0).toUpperCase() + key.substring(1)}:
                </strong>{' '}
              </Typography>
              {Object(curItem)[key] &&
                Object(curItem)[key].map((data: any) => (
                  <Chip
                    sx={{
                      mx: '0.25rem',
                      color: '#397FBF',
                      height: '27px',
                      margin: '2px 3px',
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(57, 127, 191, 0.6)',
                      },
                    }}
                    color="primary"
                    variant="outlined"
                    label={data.name || data}
                    onDelete={() => {
                      handleDelete(key, data.name || data);
                    }}
                    deleteIcon={
                      isEdit ? (
                        <Cancel sx={{ backgroundClip: 'red' }} />
                      ) : (
                        <span />
                      )
                    }
                  />
                ))}
              {isEdit && (
                <AddCircleOutline
                  style={{ color: '009054' }}
                  onClick={() => setPopupState(key)}
                />
              )}
              {/* {popupState === key && <Popup category={key} />} */}
              {popupState === key && (
                <Popup
                  category={key}
                  setPopupState={setPopupState}
                  setCurItem={setCurItem}
                />
              )}
            </Box>
          );
        })}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            my: '0.25rem',
            mx: '3.25rem',
          }}
        >
          <Typography>
            <strong>Modifications: </strong>
            {isEdit ? (
              <TextField
                sx={{ width: '350px' }}
                InputProps={{ style: { fontSize: '16px' } }}
                id="standard-basic"
                variant="standard"
                onChange={(e) => {
                  setCurItem((prevItem) => ({
                    ...prevItem,
                    modifications: e.target.value,
                  }));
                }}
                defaultValue={curItem.modifications}
              />
            ) : (
              <span style={{ width: '500px' }}>{curItem.modifications}</span>
            )}
          </Typography>
        </Box>
        {(curItem.link !== '' || isEdit) && (
          <div>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                my: '0.25rem',
                mx: '3.25rem',
              }}
            >
              <Typography noWrap>
                <strong>Link: </strong>
                {isEdit ? (
                  <TextField
                    sx={{ width: '350px' }}
                    InputProps={{ style: { fontSize: '16px' } }}
                    id="standard-basic"
                    variant="standard"
                    onChange={(e) => {
                      setCurItem((prevItem) => ({
                        ...prevItem,
                        link: e.target.value,
                      }));
                    }}
                    defaultValue={curItem.link}
                  />
                ) : (
                  <Link href={curItem.link}>{curItem.link}</Link>
                )}
              </Typography>
            </Box>
            {curItem.link && curItem.link.includes('youtube') && (
              <iframe
                width="640"
                height="480"
                src={`https://www.youtube.com/embed/${curItem.link
                  .split('=')
                  .at(-1)}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
              />
            )}
          </div>
        )}
      </Box>
    </div>
  );
}
