import { preventDefault } from '../utils';
import { Modal } from './Modal';

export function DeletePopup(props) {
    const {
        title, children, onDelete, openState,
    } = props;
    return (<Modal openState={openState}>
        <div className='modal-box'>
            <h3 className='font-bold text-lg'>{title}</h3>
            <p className='py-4'>{children}</p>
            <div className='modal-action'>
                <button className='btn btn-soft' onClick={preventDefault(() => openState[1](false))}>Annuler</button>
                <button className='btn btn-error' onClick={preventDefault(onDelete)}>Supprimer</button>
            </div>
        </div>
    </Modal>
    );
}
