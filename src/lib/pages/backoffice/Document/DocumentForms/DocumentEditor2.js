/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import { documentApi } from '@api/documents';
import { withCancel } from '@api/utils';
import Form, {
  FieldTemplate as SUIFieldTemplate,
  ObjectFieldTemplate as SUIObjectFieldTemplate,
} from '@rjsf/semantic-ui';
import SUIArrayFieldTemplate from '@rjsf/semantic-ui/dist/ArrayFieldTemplate';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

export class DocumentEditor2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      isLoading: !!props.match.params.documentPid,
      error: {},
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { documentPid },
      },
    } = this.props;
    if (documentPid) {
      this.fetchDocument(documentPid);
    }
  }

  componentWillUnmount() {
    this.cancellableFetchDocument && this.cancellableFetchDocument.cancel();
  }

  get documentRequest() {
    const request = _get(this.props, 'location.state', null);
    if (!request) return null;
    return {
      documentRequestPid: request.metadata.pid,
      metadata: {
        title: _get(request, 'metadata.title'),
        // NOTE: serializing authors for the document form
        authors: [{ full_name: _get(request, 'metadata.authors') }],
        journalTitle: _get(request, 'metadata.journal_title'),
        edition: _get(request, 'metadata.edition'),
        publication_year: String(_get(request, 'metadata.publication_year')),
      },
    };
  }

  fetchDocument = async documentPid => {
    this.cancellableFetchDocument = withCancel(documentApi.get(documentPid));
    try {
      const response = await this.cancellableFetchDocument.promise;
      this.setState({ data: response.data, isLoading: false, error: {} });
    } catch (error) {
      if (error !== 'UNMOUNTED') {
        this.setState({ isLoading: false, error: error });
      }
    }
  };

  render() {
    const {
      match: {
        params: { documentPid },
      },
    } = this.props;

    const schema = {
      definitions: {
        identifier: {
          properties: {
            scheme: {
              title: 'Scheme', // VOCABULARY
              type: 'string',
            },
            value: {
              title: 'Value',
              type: 'string',
            },
          },
          required: ['value', 'scheme'],
          type: 'object',
        },
      },
      title: 'Document',
      type: 'object',
      required: [
        'title',
        'authors',
        'publication_year',
        'document_type',
        'created_by',
      ],
      properties: {
        title: {
          title: 'Title',
          type: 'string',
        },
        alternative_titles: {
          items: {
            additionalProperties: false,
            properties: {
              language: {
                maxLength: 2,
                minLength: 2,
                title: 'Language', // VOCABULARY
                type: 'string',
              },
              source: {
                title: 'Source',
                type: 'string',
              },
              type: {
                title: 'Type', // VOCABULARY
                type: 'string',
              },
              value: {
                minLength: 1,
                title: 'Value',
                type: 'string',
              },
            },
            required: ['value'],
            type: 'object',
          },
          minItems: 1,
          title: 'Alternative titles',
          type: 'array',
          uniqueItems: true,
        },
        publication_year: {
          title: 'Publication Year',
          type: 'string',
        },
        edition: {
          title: 'Edition',
          type: 'string',
        },
        document_type: {
          enum: ['BOOK', 'PROCEEDING', 'STANDARD', 'PERIODICAL_ISSUE'],
          enumNames: ['Book', 'Proceeding', 'Standard', 'Periodical Issue'],
          title: 'Document type',
          type: 'string',
        },
        source: {
          title: 'Source of the metadata',
          type: 'string',
        },
        number_of_pages: {
          minLength: 1,
          title: 'Number of pages',
          type: 'string',
        },
        languages: {
          items: {
            type: 'string', // VOCABULARY
          },
          minItems: 1,
          title: 'Languages',
          type: 'array',
        },
        restricted: {
          default: false,
          title: 'Restricted',
          type: 'boolean',
        },
        authors: {
          items: {
            additionalProperties: false,
            properties: {
              affiliations: {
                items: {
                  additionalProperties: false,
                  properties: {
                    identifiers: {
                      items: {
                        $ref: '#/definitions/identifier',
                      },
                      title: 'Identifiers',
                      type: 'array',
                    },
                    name: {
                      title: 'Name',
                      type: 'string',
                    },
                  },
                  required: ['name'],
                  type: 'object',
                },
                minItems: 1,
                title: 'Affiliations',
                type: 'array',
                uniqueItems: true,
              },
              alternative_names: {
                items: {
                  minLength: 1,
                  type: 'string',
                },
                minItems: 1,
                title: 'Other names',
                type: 'array',
                uniqueItems: true,
              },
              full_name: {
                minLength: 1,
                title: 'Name',
                type: 'string',
              },
              identifiers: {
                items: {
                  $ref: '#/definitions/identifier',
                },
                minItems: 1,
                title: 'Identifiers',
                type: 'array',
                uniqueItems: true,
              },
              roles: {
                items: {
                  minLength: 1,
                  type: 'string',
                },
                minItems: 1,
                title: 'Roles', // VOCABULARY
                type: 'array',
                uniqueItems: true,
              },
              type: {
                title: 'Type', // VOCABULARY
                type: 'string',
              },
            },
            required: ['full_name'],
            type: 'object',
          },
          minItems: 1,
          title: 'Authors',
          type: 'array',
          uniqueItems: false,
        },
        other_authors: {
          title: 'Other authors.',
          type: 'boolean',
        },
        identifiers: {
          items: {
            properties: {
              material: {
                title: 'Material to which the identifiers refers to',
                type: 'string',
              },
              scheme: {
                title: 'Scheme', // VOCABULARY
                type: 'string',
              },
              value: {
                title: 'Value',
                type: 'string',
              },
            },
            required: ['value', 'scheme'],
          },
          title: 'Identifiers',
          type: 'array',
        },
        alternative_identifiers: {
          items: {
            $ref: '#/definitions/identifier',
          },
          title: 'Alternative identifiers',
          type: 'array',
        },
        urls: {
          items: {
            properties: {
              description: {
                title: 'Description',
                type: 'string',
              },
              value: {
                format: 'uri',
                title: 'URL',
                type: 'string',
              },
            },
            required: ['value'],
            title: 'URLs',
            type: 'object',
          },
          minItems: 1,
          type: 'array',
          uniqueItems: true,
        },
        note: {
          title: 'Notes',
          type: 'string',
        },
        abstract: {
          title: 'Abstract',
          type: 'string',
        },
        alternative_abstracts: {
          items: {
            type: 'string',
          },
          title: 'Supplementary abstracts',
          type: 'array',
          uniqueItems: true,
        },
        tags: {
          items: {
            title: 'Name',
            type: 'string',
          },
          title: 'Tags', // VOCABULARY
          type: 'array',
          uniqueItems: true,
        },
        keywords: {
          items: {
            properties: {
              source: {
                title: 'Source',
                type: 'string',
              },
              value: {
                title: 'Value',
                type: 'string',
              },
            },
          },
          title: 'Keywords',
          type: 'array',
        },
        subjects: {
          items: {
            properties: {
              scheme: {
                title: 'Scheme of subject classification',
                type: 'string',
              },
              value: {
                title: 'Subject classification',
                type: 'string',
              },
            },
            required: ['value', 'scheme'],
            type: 'object',
          },
          title: 'Subjects',
          type: 'array',
          uniqueItems: true,
        },
        table_of_content: {
          items: {
            type: 'string',
          },
          title: 'Chapters',
          type: 'array',
        },
        curated: {
          title: 'Curated',
          type: 'boolean',
        },
        internal_notes: {
          items: {
            properties: {
              field: {
                title: 'Field to which the note refers to',
                type: 'string',
              },
              user: {
                title: 'User who has composed the note',
                type: 'string',
              },
              value: {
                title: 'Note',
                type: 'string',
              },
            },
            required: ['value'],
          },
          title: 'Internal notes (not visible to users)',
          type: 'array',
          uniqueItems: true,
        },
        copyrights: {
          items: {
            properties: {
              holder: {
                minLength: 1,
                title: 'Copyright holder',
                type: 'string',
              },
              material: {
                minLength: 1,
                title: 'Material to which the copyright refers',
                type: 'string',
              },
              statement: {
                minLength: 1,
                title: 'Copyright notice',
                type: 'string',
              },
              url: {
                format: 'uri',
                minLength: 1,
                title: 'Copyright notice URL',
                type: 'string',
              },
              year: {
                minimum: 1900,
                title: 'Year',
                type: 'integer',
              },
            },
            type: 'object',
          },
          minItems: 1,
          title: 'List of copyrights',
          type: 'array',
          uniqueItems: true,
        },
        licenses: {
          items: {
            properties: {
              internal_notes: {
                title: 'Internal notes',
                type: 'string',
              },
              license: {
                properties: {
                  id: {
                    title: 'Identifier',
                    type: 'string',
                  },
                  maintainer: {
                    title: 'Maintainer',
                    type: 'string',
                  },
                  status: {
                    enum: ['active', 'superseded', 'retired'],
                    enumNames: ['Active', 'Superseded', 'Retired'],
                    title: 'Status',
                  },
                  title: {
                    title: 'Title',
                    type: 'string',
                  },
                  url: {
                    title: 'URL',
                    type: 'string',
                  },
                },
                type: 'object',
              },
              material: {
                title: 'Material to which the license refers to',
                type: 'string',
              },
            },
            type: 'object',
          },
          minItems: 1,
          title: 'Licenses', // VOCABULARY
          type: 'array',
          uniqueItems: true,
        },
        imprint: {
          properties: {
            date: {
              minLength: 1,
              title: 'Date of publication',
              type: 'string',
            },
            place: {
              minLength: 1,
              title: 'Place of publication',
              type: 'string',
            },
            publisher: {
              minLength: 1,
              title: 'Publisher',
              type: 'string',
            },
            reprint: {
              minLength: 1,
              title: 'Reprint identifier',
              type: 'string',
            },
          },
          title: 'Imprint',
          type: 'object',
        },
        publication_info: {
          items: {
            additionalProperties: false,
            properties: {
              artid: {
                title: 'Article identifier',
                type: 'string',
              },
              journal_issue: {
                title: 'Journal Issue',
                type: 'string',
              },
              journal_title: {
                title: 'Journal Title',
                type: 'string',
              },
              journal_volume: {
                title: 'Journal Volume',
                type: 'string',
              },
              note: {
                title: 'Notes',
                type: 'string',
              },
              pages: {
                title: 'Pages range',
                type: 'string',
              },
              year: {
                minimum: 1000,
                title: 'Publication year',
                type: 'integer',
              },
            },
            type: 'object',
          },
          title: 'Publication information',
          type: 'array',
          uniqueItems: true,
        },
        conference_info: {
          properties: {
            acronym: {
              minLength: 1,
              title: 'Acronym',
              type: 'string',
            },
            country: {
              minLength: 1,
              title: 'Country', // VOCABULARY
              type: 'string',
            },
            dates: {
              minLength: 1,
              title: 'Dates',
              type: 'string',
            },
            identifiers: {
              items: {
                $ref: '#/definitions/identifier',
              },
              title: 'Identifiers',
              type: 'array',
            },
            place: {
              title: 'Place',
              type: 'string',
            },
            series: {
              minLength: 1,
              title: 'Conference as a part of series.',
              type: 'string',
            },
            title: {
              minLength: 1,
              title: 'Title',
              type: 'string',
            },
            year: {
              minLength: 1,
              title: 'Year',
              type: 'integer',
            },
          },
          required: ['place', 'title'],
          title: 'Conference',
          type: 'object',
        },
      },
    };
    const uiSchema = {
      title: {
        'ui:before': <h1 className="ui header">Basic Information</h1>,
      },
    };

    function CustomFieldTemplate(props) {
      const before =
        'ui:before' in props.uiSchema ? props.uiSchema['ui:before'] : null;
      const after =
        'ui:after' in props.uiSchema ? props.uiSchema['ui:after'] : null;
      return (
        <>
          {before}
          <SUIFieldTemplate {...props} />
          {after}
        </>
      );
    }

    function CustomObjectFieldTemplate(props) {
      const before =
        'ui:before' in props.uiSchema ? props.uiSchema['ui:before'] : null;
      const after =
        'ui:after' in props.uiSchema ? props.uiSchema['ui:after'] : null;
      return (
        <>
          {before}
          <SUIObjectFieldTemplate {...props} />
          {after}
        </>
      );
    }

    function CustomArrayFieldTemplate(props) {
      const before =
        'ui:before' in props.uiSchema ? props.uiSchema['ui:before'] : null;
      const after =
        'ui:after' in props.uiSchema ? props.uiSchema['ui:after'] : null;
      return (
        <>
          {before}
          <SUIArrayFieldTemplate {...props} />
          {after}
        </>
      );
    }

    return (
      <Container>
        <Form
          schema={schema}
          uiSchema={uiSchema}
          ObjectFieldTemplate={CustomObjectFieldTemplate}
          FieldTemplate={CustomFieldTemplate}
          ArrayFieldTemplate={CustomArrayFieldTemplate}
        />
      </Container>
    );
  }
}

DocumentEditor2.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      documentPid: PropTypes.string,
    }),
  }).isRequired,
};
