import {create} from 'tailwind-rn';
import styles from '../styles.json';

const {tailwind, getColor: _getColor} = create(styles);

export const getColor = _getColor

export default tailwind
