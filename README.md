# check-test-allowed-action
## Usage
### Simple
```yaml
...
    steps:
...
      - name: Check integration test allowance status
        id: check_approvals
        uses: adiantum/check-test-allowed-action@b5692d590739f87afd4c2f678533a3db9da13ab6
...
```
### With optional params
```yaml
...
    steps:
...
      - name: Check integration test allowance status
        id: check_approvals
        uses: adiantum/check-test-allowed-action@b5692d590739f87afd4c2f678533a3db9da13ab6
        with:
          review_approvals_count: 2 # optional, default: 1, The number of approvals required for the PR to be tested
          approval_labels: "integration-test" # optional, default: "integration-test, skip_integration", Comma-separated list of labels that allow integration tests to run
...
```
