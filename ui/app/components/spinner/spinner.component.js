import React from 'react'
import PropTypes from 'prop-types'

const Spinner = ({ className = '', color = '#000000' }) => {
  return (
    <div className={`spinner ${className}`}><i></i><i></i><i></i></div>
 )
}

Spinner.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
}

module.exports = Spinner
