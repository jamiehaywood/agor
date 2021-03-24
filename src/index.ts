import { ParsedArgs } from 'minimist';
import childProcess from 'child_process';
import util from 'util';
import color from 'ansi-colors';

const exec = util.promisify(childProcess.exec);

interface Agor extends ParsedArgs {
  address?: string;
  device?: string;
  a?: string;
  d?: string;
}

export async function agor(args: Agor) {
  const deviceName = args.d || args.device || 'iPhone 12';
  const simulatorName = `agor-${deviceName}`.replace(/ /g, '').toLowerCase();
  const address = args.a || args.address;

  if (!address) {
    console.log(
      color.redBright.bold(
        '\n 📱 Agor needs an address for the iOS simulator to navigate to. \n'
      )
    );
    process.exit(1);
  }

  if (!/^https?:\/\/\w+(:[0-9]*)?(\.\w+)?$/.test(address)) {
    console.log(color.redBright.bold('\n 📱 Agor requires a valid url. \n'));
    process.exit(1);
  }

  // check if the device already exists
  await createIfNotExist(simulatorName, deviceName);

  await startSequence(simulatorName, address);
}

async function startSequence(simulatorName: string, url: string) {
  try {
    await exec(`xcrun simctl boot ${simulatorName}`);
  } catch (e) {
    // the possible exception that it's already booted
    await exec(`xcrun simctl openurl ${simulatorName} ${url}`);
    await exec('open -a Simulator.app');
  }
}

async function createIfNotExist(simulatorName: string, deviceName: string) {
  const { stdout } = await exec('xcrun simctl list');

  const deviceExists = RegExp(simulatorName).test(stdout);

  if (!deviceExists) {
    console.log('Agor simulator does not exist. Creating now...');
    await exec(`xcrun simctl create ${simulatorName} "${deviceName}"`);
  }
}
