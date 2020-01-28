import React, { Component } from 'react';
import parse from 'comment-parser';
import PropTypes from 'prop-types';
import { Block, Text, Row } from '@aztec/guacamole-ui';

import MethodArgumentRenderer from './MethodArgumentRenderer';
import MethodDescription from './MethodDescription';
import MethodReturnRenderer from './MethodReturnRenderer';
import parseTagsForAPI from '../utils/parseTagsForAPI';

class LiveDocUpdate extends Component {
  state = {
    parsedDescription: [],
    parsedReturns: [],
    parsedArguments: [],
  };

  componentDidMount() {
    const { name } = this.props;
    if (name.includes('.')) {
      this.parseGitDocs();
    }
  }

  componentDidUpdate(prevProps) {
    const { name: prevName } = prevProps;
    const { name } = this.props;

    if (prevName !== name && name.includes('.')) {
      this.parseGitDocs();
    }
  }

  parseGitDocs = async () => {
    const url =
      'https://raw.githubusercontent.com/AztecProtocol/AZTEC/8453b6009bf343937acb42879323833df47f00b6/packages/extension/src/client/apis/ZkAsset.js';
    const response = await fetch(url);
    const apiText = await response.text();

    const parsedTags = parse(apiText.toString());
    const { name } = this.props;

    let APItags;
    try {
      APItags = parseTagsForAPI(name, parsedTags);
    } catch (error) {
      throw new Error('Could not fetch docs for this API method');
    }

    const parsedArguments = APItags.tags.filter((tag) => {
      return tag.tag !== 'returns' && tag.tag !== 'function' && tag.tag !== 'description';
    });

    const parsedReturns = APItags.tags.filter((tag) => {
      return tag.tag === 'returns';
    });

    const parsedDescription = APItags.tags.filter((tag) => {
      return tag.tag === 'description';
    });

    this.setState({ parsedArguments, parsedReturns, parsedDescription: parsedDescription[0] });
  };

  render() {
    const { parsedArguments, parsedReturns, parsedDescription } = this.state;

    return (
      <Block>
        <MethodDescription {...parsedDescription} />
        <MethodArgumentRenderer methods={[...parsedArguments]} />
        <MethodReturnRenderer methods={[...parsedReturns]} />
      </Block>
    );
  }
}

LiveDocUpdate.propTypes = {
  name: PropTypes.string.isRequired,
};

export default LiveDocUpdate;