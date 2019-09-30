import React from 'react';
import { SelectControl } from '@wordpress/components';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// import AceEditor from "react-ace";

// import 'brace';
// import 'brace/mode/json';
// import 'brace/theme/github';

function App() {
  const { data } = useQuery(gql`
    query {
      __schema {
        queryType {
          fields {
            name
            type {
              kind
            }
          }
        }
      }
    }
  `);

  return (
    <div>
      <SelectControl
        label="Section"
        value=""
        options={[
          {
            label: 'Population',
            value: 'population'
          }
        ]}
        onChange={id => {
          console.log(id);
        }}
      />
      <SelectControl
        label="Table"
        value=""
        options={
          data
            ? /* eslint-disable-next-line no-underscore-dangle */
              data.__schema.queryType.fields
                .filter(field => field.name.slice(0, 3) === 'all')
                .filter(
                  field =>
                    !/Takwimu|Wagtail|Django|Wazimap|Account|Auth|Census/gi.test(
                      field.name
                    )
                )
                .map(field => ({
                  label: field.name,
                  value: field.name
                }))
            : []
        }
        onChange={id => {
          console.log(id);
        }}
      />
      {/* <AceEditor
        enableLiveAutocompletion
        enableBasicAutocompletion
        theme="github"
        mode="json"
        name="1234"
        value={"{}"}
        editorProps={{ $blockScrolling: true }}
      /> */}
    </div>
  );
}

export default App;
