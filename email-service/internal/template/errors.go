package template

import "errors"

var (
	// ErrTemplateNotFound indicates that a requested template could not be found in the cache.
	ErrTemplateNotFound = errors.New("template not found")
	// ErrTemplateRead indicates an error reading template files from disk.
	ErrTemplateRead = errors.New("failed to read template directory or files")
	// ErrTemplateParse indicates an error parsing template files.
	ErrTemplateParse = errors.New("failed to parse template")
	// ErrTemplateExecute indicates an error executing (rendering) a template.
	ErrTemplateExecute = errors.New("failed to execute template")
)
