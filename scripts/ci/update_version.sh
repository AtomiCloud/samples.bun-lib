#!/usr/bin/env bash
set -eou pipefail

version="$1"
package_path="${2:-./package.json}"

tmpfile=$(mktemp)
jq --arg new_version "${version}" '.version = $new_version' "${package_path}" >"$tmpfile"
mv "$tmpfile" "${package_path}"
