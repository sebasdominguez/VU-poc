/* eslint-disable */
import useScript from '../hooks/useScript';
import useStyle from '../hooks/useStyle';
import { useState } from 'react';

const SOPRender = () => {
  const [configureUi, setConfigureUi] = useState(false);
  const [numOfChallenges, setNumOfChallenges] = useState(3);
  const [allChallenges, setAllChallenges] = useState([
    'smile',
    'lookLeft',
    'lookRight',
  ]);
  const [gestures, setGestures] = useState([
    { id: 'smile', name: 'Smile', checked: true, order: 1 },
    { id: 'lookRight', name: 'Right face turn', checked: true, order: 2 },
    { id: 'lookLeft', name: 'Left face turn', checked: true, order: 3 },
  ]);

  let loadAttempts = 0;
  useStyle('/onboarding/css/vu.sop.ui.css');

  useScript('/onboarding/js/vu.sop.js', async () => {
    try {
      await loadFiles();
    } catch (error) {
      loadAttempts++;

      if (loadAttempts < 11) {
        await loadFiles();
      } else {
        alert(error);
      }
    }
  });

  const loadFiles = async () => {
    try {
      vu.sop.useGestures = 'mixedChallenge';
      vu.sop.audio.enabled = false;
      await vu.sop.load('onboarding/');
    } catch (error) {
      throw error;
    }
  };

  const showConfig = async () => {
    await vu.sop.ui.hide('mainNav');
    await vu.sop.ui.show('configContainer');
    setConfigureUi(true);
  };

  const hideConfig = async () => {
    await vu.sop.ui.hide('configContainer');
    await vu.sop.ui.show('mainNav');
    setConfigureUi(false);
    genChallenges();
  };

  const captureSelfie = async () => {
    try {
      await vu.sop.ui.hide('mainNav');
      await vu.sop.ui.show('vu.sop');
      let pictures = await vu.sop.steps.captureSelfie();

      // Mostramos la imagen
      vu.sop.ui.hide('vu.sop');
      // Cortamos la camara
      vu.camera.stream.getTracks().forEach(function (track) {
        track.stop();
      });
      await vu.sop.ui.show('mainNav');

      document.getElementById('modal-body-img').src =
        'data:image/jpeg;base64,' + pictures[pictures.length - 1];

      $('#resultModal').modal();
    } catch (e) {
      console.log(e);
    }
  };

  const updatecantidadGestosInput = (e) => {
    const { value } = e.target;
    setNumOfChallenges(() => +value);
  };

  const updateGestos = (e) => {
    const { id, checked } = e.target;
    const gesture = gestures.find((gesture) => gesture.id === id);

    if (!checked) {
      if (allChallenges.length - 1 < +numOfChallenges) {
        alert(
          'La cantidad de gestos no son sufcientes para realizar la pruba de vida'
        );
      } else {
        gesture.checked = checked;
        const newallChallenges = allChallenges.filter(
          (challenge) => challenge !== id
        );
        setAllChallenges(() => newallChallenges);
      }
    } else {
      setAllChallenges(() => [...allChallenges, id]);
      gesture.checked = true;
      e.target.checked = true;
    }

    let newGestures = gestures.filter((gesture) => gesture.id !== id);
    newGestures.push(gesture);
    newGestures.sort((a, b) => {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      return 0;
    });

    setGestures(newGestures);
  };

  const genChallenges = () => {
    vu.face.ui.gestures.numOfChallenges = numOfChallenges;
    vu.face.ui.gestures.allChallenges = allChallenges;
    vu.face.ui.gestures.genChallenges();
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <div id='vu.sop' style={{ display: 'none', width: '100%' }} />
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <nav
          className='navbar '
          id='mainNav'
          style={{ display: `${!configureUi ? 'block' : 'none'}` }}
        >
          <div
            style={{ padding: '10px' }}
            className='container bg-light rounded border m-1'
            id='config-menu-container'
          >
            <div
              className='btn-group-vertical text-center'
              role='group'
              style={{ textAlign: 'center', width: '100%', padding: '10px' }}
            >
              <button
                type='button'
                className='btn btn-primary border m-0'
                onClick={showConfig}
              >
                SETTINGS
              </button>
            </div>
          </div>
          <div
            className='container bg-light rounded border m-1'
            id='demo-menu-container'
          >
            <p style={{ width: '100%', textAlign: 'center' }}>Demo</p>
            <div
              className='btn-group-vertical text-center'
              role='group'
              style={{ textAlign: 'center', width: '100%', padding: '10px' }}
            >
              <button
                type='button'
                className='btn btn-primary border m-0'
                onClick={captureSelfie}
              >
                LIVENESS PROOF
              </button>
            </div>
          </div>
        </nav>
        <div className='container'>
          <div className='modal fade' id='resultModal'>
            <div className='modal-dialog mw-100'>
              <div className='modal-content' style={{ height: '100%' }}>
                <div className='modal-header'>
                  <button type='button' className='close' data-dismiss='modal'>
                    &times;
                  </button>
                </div>

                <div className='modal-body' id='modal-body'>
                  <img
                    id='modal-body-img'
                    height='100%'
                    min-width='100%'
                    src='#'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className='container'
          id='configContainer'
          style={{
            textAlign: 'left',
            width: '100%',
            display: `${configureUi ? 'block' : 'none'}`,
          }}
        >
          <div className='container bg-light rounded border m-1'>
            <p id='cantidadGestosText' style={{ textAlign: 'left' }}>
              Number of gestures: {numOfChallenges}
            </p>
            <input
              type='range'
              className='custom-range'
              min='1'
              max='3'
              id='cantidadGestosRange'
              onChange={updatecantidadGestosInput}
            />
          </div>

          <div className='container bg-light rounded border m-1'>
            <p>Gestures enabled</p>
            {gestures.map((gesture) => (
              <>
                <input
                  type='checkbox'
                  id={gesture.id}
                  checked={gesture.checked}
                  name={gesture.id}
                  value={gesture.id}
                  onChange={updateGestos}
                />
                <label htmlFor={gesture.id}> {gesture.name}</label>
                <br />
              </>
            ))}

            <button
              type='button'
              className='btn btn-primary border m-0'
              onClick={hideConfig}
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOPRender;
