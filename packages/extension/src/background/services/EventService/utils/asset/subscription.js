import Web3Service from '~helpers/NetworkService';
import {
    ACEConfig,
} from '~config/contracts';
import {
    errorLog,
} from '~utils/log';

const converEvent = (event) => {
    const {
        blockNumber,
        returnValues: {
            registryOwner,
            registryAddress,
            scalingFactor,
            linkedTokenAddress,
            canAdjustSupply,
            canConvert,
        },
    } = event;

    return {
        blockNumber,
        registryOwner,
        registryAddress,
        scalingFactor,
        linkedTokenAddress,
        canAdjustSupply,
        canConvert,
    };
};

const subscribe = async ({
    fromBlock,
    networkId,
} = {}) => {
    if (!networkId) {
        errorLog("'networkId' cannot be empty in assets subscription");
        return null;
    }

    const eventName = ACEConfig.events.сreateNoteRegistry;

    const options = {
        fromBlock,
    };

    const subscription = (await Web3Service({ networkId }))
        .useContract(ACEConfig.name)
        .events(eventName)
        .subscribe(options, (error) => {
            if (error) {
                errorLog(error);
            }
        });

    return {
        subscription,
        onData: (callback) => {
            subscription.on('data', (event) => {
                callback(converEvent(event));
            });
        },
        onError: (callback) => {
            subscription.on('error', (error) => {
                callback(error);
            });
        },
    };
};


export default {
    subscribe,
};