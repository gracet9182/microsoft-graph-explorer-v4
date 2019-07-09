import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React from 'react';
import { IRequestComponent } from '../../../../types/request';
import { Monaco } from '../../common/monaco/Monaco';
import './request.scss';
import RequestHeaders from './RequestHeaders';

const Request = ({
  sampleBody,
  handleOnEditorChange,
  headers,
}: IRequestComponent) => {
  // tslint:disable-next-line
  console.log(sampleBody);

  return (
    <div className='request-editors'>
      <Pivot>
        <PivotItem headerText='Request Body'>
          <Monaco
            body={sampleBody}
            onChange={(value) => handleOnEditorChange(value)} />
        </PivotItem>
        <PivotItem headerText='Request Headers'>
          // @ts-ignore
          <RequestHeaders
            headers={headers}
          />
        </PivotItem>
      </Pivot>
    </div>
  );
};

export default Request;
