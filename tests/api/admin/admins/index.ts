import create      from './create';
import show        from './show';
import list        from './list';
import update      from './update';
import deleteAdmin from './delete';
import showMe      from './showMe';
import updateMe    from './updateMe';

export default [
    ...create,
    ...show,
    ...list,
    ...update,
    ...deleteAdmin,
    ...showMe,
    ...updateMe
];
