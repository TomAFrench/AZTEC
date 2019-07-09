import dataKey from '~config/dataKey';
import Model from '~database/helpers/Model';

export default Model({
    name: 'noteAccess',
    dataKeyPattern: dataKey.noteAccess,
    fields: [
        'sharedSecret',
        'value',
        'asset',
        'owner',
        'status',
    ],
});