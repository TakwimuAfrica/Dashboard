import React from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useState } from '@wordpress/element';
import {
  Button,
  PanelBody,
  PanelRow,
  SandBox,
  SelectControl,
  TextControl
} from '@wordpress/components';
import { InspectorControls, InnerBlocks } from '@wordpress/editor';
import { Formik, Form, FieldArray } from 'formik';

import withRoot from '../withRoot';
import propTypes from '../propTypes';

function Edit({
  attributes: { description, row, rowsLayout, title },
  setAttributes
}) {
  const [template, setTemplate] = useState([]);
  const [defaultRowsLayout, setDefaultRowsLayout] = useState(
    Array(parseInt(row, 10)).fill('100')
  );

  useEffect(() => {
    if (rowsLayout && rowsLayout.length > 0) {
      setTemplate(
        Array(parseInt(row, 10))
          .fill('')
          .map((j, index) => {
            const chartLayout = rowsLayout[index];
            return [
              'core/column',
              { width: 100 },
              [['hurumap/section-row-block', { layout: chartLayout }]]
            ];
          })
      );
    }
  }, [row, rowsLayout]);

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Section', 'hurumap')}>
          <PanelRow>
            <TextControl
              label="Section Title"
              value={title}
              onChange={titleText => {
                setAttributes({ title: titleText });
              }}
            />
          </PanelRow>
          <PanelRow>
            <TextControl
              label="Section Description"
              value={description}
              onChange={descriptionText => {
                setAttributes({ description: descriptionText });
              }}
            />
          </PanelRow>
          <PanelRow>
            <SelectControl
              label={__('Rows', 'hurumap')}
              value={row}
              options={[
                { value: null, label: 'Select number of rows', disable: true },
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 3, label: '3' }
              ]}
              onChange={selectedrow => {
                setAttributes({ row: selectedrow });
                setDefaultRowsLayout(
                  Array(parseInt(selectedrow, 10)).fill('100')
                );
              }}
            />
          </PanelRow>
        </PanelBody>
        <PanelBody title={__('Rows Layouts', 'hurumap')}>
          <PanelRow>
            {parseInt(row, 10) > 0 && (
              <Formik
                initialValues={
                  rowsLayout && rowsLayout.length
                    ? { layouts: rowsLayout }
                    : { layouts: defaultRowsLayout }
                }
                onSubmit={values => {
                  setAttributes({ rowsLayout: values.layouts });
                }}
                render={form => (
                  <Form>
                    <FieldArray
                      name="layouts"
                      render={({ replace }) => (
                        <>
                          {form.values.layouts &&
                            form.values.layouts.length > 0 &&
                            form.values.layouts.map((layout, index) => (
                              <SelectControl
                                label={`Layout for row ${index + 1}`}
                                value={layout}
                                options={[
                                  {
                                    value: null,
                                    label: 'Select Layout',
                                    disable: true
                                  },
                                  {
                                    value: '33.33-33.33-33.33',
                                    label: 'Three Thirds'
                                  },
                                  {
                                    value: '33.33-66.67',
                                    label: 'A third, Two thirds'
                                  },
                                  {
                                    value: '66.67-33.33',
                                    label: 'Two thirds, A thirds'
                                  },
                                  { value: '50-50', label: 'Two halves' },
                                  { value: '100', label: 'A whole' }
                                ]}
                                onChange={selectedLayout => {
                                  replace(index, selectedLayout);
                                  form.values.layouts[index] = selectedLayout; // eslint-disable-line no-param-reassign
                                }}
                              />
                            ))}
                          <Button
                            style={{
                              background: '#007cba',
                              borderColor: '#007cba',
                              borderRadius: '3px',
                              margin: '2px',
                              height: '33px',
                              color: '#fff'
                            }}
                            type="submit"
                          >
                            Update{' '}
                          </Button>
                        </>
                      )}
                    />
                  </Form>
                )}
              />
            )}
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <h1>{title}</h1>
      <SandBox html={description} />
      <InnerBlocks
        template={
          parseInt(row, 10) > 0 &&
          rowsLayout &&
          rowsLayout.length > 0 &&
          template
        }
      />
    </Fragment>
  );
}

Edit.propTypes = {
  attributes: propTypes.shape({
    title: propTypes.string,
    description: propTypes.string,
    row: propTypes.string,
    rowsLayout: propTypes.array
  }).isRequired,
  setAttributes: propTypes.func.isRequired
};

export default withRoot(Edit);
