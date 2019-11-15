import { IconButton, Pivot, PivotItem } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { ThemeContext } from '../../../themes/theme-context';
import { Mode } from '../../../types/action';
import { IQueryResponseProps } from '../../../types/query-response';
import { Image, Monaco } from '../common';
import AdaptiveCard from './adaptive-cards/AdaptiveCard';
import { darkThemeHostConfig, lightThemeHostConfig } from './adaptive-cards/AdaptiveHostConfig';
import './query-response.scss';
import { Snippets } from './snippets';

class QueryResponse extends Component<IQueryResponseProps, {}> {
  constructor(props: any) {
    super(props);
  }

  public handleShareQuery = () => {
    const query = this.generateShareQueryParams();
  }

  private generateShareQueryParams = (): string => {
    const { sampleQuery } = this.props;
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const graphUrl = new URL(sampleQuery.sampleUrl).origin;
    /**
     * To ensure backward compatibility the version is removed from the pathname.
     * V3 expects the request query param to not have the version number.
     */
    const graphUrlRequest = new URL(sampleQuery.sampleUrl).pathname.substr(6);
    const uriEncodedRequestBody = encodeURI(JSON.stringify(sampleQuery.sampleBody));

    return origin + pathname
      + '?request=' + graphUrlRequest
      + '&method=' + sampleQuery.selectedVerb
      + '&version=' + sampleQuery.selectedVersion
      + '&GraphUrl=' + graphUrl
      + '&requestBody' + uriEncodedRequestBody;
  }

  public render() {
    let body: any;
    let headers;
    let isImageResponse;
    const {
      intl: { messages },
      verb
    }: any = this.props;

    const { graphResponse, mode } = this.props;
    if (graphResponse) {
      body = graphResponse.body;
      headers = graphResponse.headers;

      if (body) {
        /**
         * body.body is a getter propety for the Body mixin. It is used to access the ReadableStream property.
         * https://developer.mozilla.org/en-US/docs/Web/API/Body/body
         */
        isImageResponse = body && body.body;
      }
    }

    const pivotItems = [
      <PivotItem
        key='response-preview'
        ariaLabel='Response Preview'
        headerText={messages['Response Preview']}
      >
        {isImageResponse ? (
          <Image
            styles={{ padding: '10px' }}
            body={body}
            alt='profile image'
          />
        ) : (
            <Monaco body={body} verb={verb} />
          )}
      </PivotItem>,
      <PivotItem
        key='response-headers'
        ariaLabel='Response Headers'
        headerText={messages['Response Headers']}
      >
        <Monaco body={headers} />
      </PivotItem>
    ];

    if (mode === Mode.Complete) {
      pivotItems.push(
        <PivotItem
          key='adaptive-cards'
          ariaLabel='Adaptive Cards'
          headerText={messages['Adaptive Cards']}
        >
          <ThemeContext.Consumer >
            {(theme) => (
              // @ts-ignore
              <AdaptiveCard
                body={body}
                hostConfig={theme === 'light' ? lightThemeHostConfig : darkThemeHostConfig}
              />
            )}
          </ThemeContext.Consumer>
        </PivotItem>
      );
      pivotItems.push(
        <PivotItem
          key='code-snippets'
          ariaLabel='Code Snippets'
          headerText={messages.Snippets}
        >
          <Snippets />
        </PivotItem>
      );
    }

    return (
      <div className='query-response'>
        <IconButton onClick={this.handleShareQuery} className='share-query-btn' iconProps={{
          iconName: 'Share'
        }} />
        <Pivot className='pivot-response'>
          {pivotItems}
        </Pivot>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    graphResponse: state.graphResponse,
    appTheme: state.theme,
    mode: state.graphExplorerMode,
    scopes: state.scopes.data,
    sampleQuery: state.sampleQuery
  };
}

// @ts-ignore
const WithIntl = injectIntl(QueryResponse);
export default connect(mapStateToProps)(WithIntl);

