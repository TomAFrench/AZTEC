import React from 'react';
import PropTypes from 'prop-types';
import {
    valueOf,
} from '~/utils/note';
import {
    inputAmountType,
} from '~/ui/config/propTypes';
import {
    emptyIntValue,
} from '~/ui/config/settings';
import parseInputAmount from '~/ui/utils/parseInputAmount';
import apis from '~uiModules/apis';
import makeAsset from '~/ui/utils/makeAsset';
import returnAndClose from '~/ui/helpers/returnAndClose';
import getGSNConfig from '~/ui/helpers/getGSNConfig';
import StepsHandler from '~/ui/views/handlers/StepsHandler';
import CreateNoteFromBalanceContent from '~/ui/views/CreateNoteFromBalanceContent';
import createNoteFromBalanceSteps from '~/ui/steps/createNoteFromBalance';

const handleClose = (accumData) => {
    const {
        remainderNote,
        outputNotes,
    } = accumData;
    const targetOutputNotes = !remainderNote
        ? outputNotes
        : outputNotes.filter(note => note.noteHash !== remainderNote.noteHash);
    const notes = targetOutputNotes.map(note => ({
        noteHash: note.noteHash,
        value: valueOf(note),
    }));

    returnAndClose({
        ...accumData,
        notes,
    });
};

const CreateNoteFromBalance = ({
    currentAccount,
    assetAddress,
    amount: inputAmount,
    numberOfInputNotes,
    numberOfOutputNotes,
    userAccess,
}) => {
    const {
        address: currentAddress,
    } = currentAccount;

    const fetchInitialData = async () => {
        const gsnConfig = await getGSNConfig();
        const {
            isGSNAvailable,
            proxyContract,
        } = gsnConfig;
        const steps = createNoteFromBalanceSteps[isGSNAvailable ? 'gsn' : 'metamask'];

        const asset = await makeAsset(assetAddress);
        const userAccessAccounts = userAccess
            ? await apis.account.batchGetExtensionAccount(userAccess)
            : [];
        const sender = proxyContract;
        const amount = parseInputAmount(inputAmount);
        const transactions = [
            {
                amount,
                to: currentAddress,
            },
        ];

        return {
            steps,
            retryWithMetaMaskStep: createNoteFromBalanceSteps.metamask.slice(-1)[0],
            assetAddress,
            currentAddress,
            asset,
            sender,
            amount,
            numberOfInputNotes,
            numberOfOutputNotes,
            userAccessAccounts,
            publicOwner: currentAddress,
            spender: sender,
            transactions,
            gsnConfig,
            isGSNAvailable,
        };
    };

    return (
        <StepsHandler
            testId="steps-create-note"
            fetchInitialData={fetchInitialData}
            onExit={handleClose}
            Content={CreateNoteFromBalanceContent}
        />
    );
};

CreateNoteFromBalance.propTypes = {
    currentAccount: PropTypes.shape({
        address: PropTypes.string.isRequired,
    }).isRequired,
    assetAddress: PropTypes.string.isRequired,
    amount: inputAmountType.isRequired,
    numberOfInputNotes: PropTypes.number,
    numberOfOutputNotes: PropTypes.number,
    userAccess: PropTypes.arrayOf(PropTypes.string),
};

CreateNoteFromBalance.defaultProps = {
    numberOfInputNotes: emptyIntValue,
    numberOfOutputNotes: emptyIntValue,
    userAccess: [],
};

export default CreateNoteFromBalance;
