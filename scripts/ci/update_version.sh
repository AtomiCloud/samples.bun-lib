#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 || -z ${1:-} ]]; then
  echo "Usage: $0 <version> [package_json_path]" >&2
  exit 1
fi

version="$1"
package_path="${2:-./package.json}"

tmpfile="$(mktemp)"
trap 'rm -f "$tmpfile"' EXIT
jq --arg new_version "${version}" '.version = $new_version' "${package_path}" >"$tmpfile"
mv "$tmpfile" "${package_path}"
trap - EXIT
