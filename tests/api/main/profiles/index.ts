import create        from './create';
import show          from './show';
import update        from './update';
import deleteProfile from './delete';
import resetPassword from './resetPassword';

export default [
    ...create,
    ...show,
    ...update,
    ...deleteProfile,
    ...resetPassword
];
