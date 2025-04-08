import { getInput, setFailed, setOutput } from '@actions/core';
import { context as _context, getOctokit } from '@actions/github';

try {
    // `github.context` is the context of the workflow run
    const context = _context;

    // get github token
    const token = getInput('github-token', { required: true });
    if (!token) {
        throw new Error('GitHub token is required');
    }

    // `github.getOctokit` creates a GitHub client with the token
    const octokit = getOctokit(token);
    
    // `core.getInput` gets the input from the workflow file
    const input = getInput('input');
    
    // Log the context and input for debugging
    console.log('Context:', context);
    console.log('Input:', input);
    
    // Get the current PR number from the context
    const prNumber = context.payload.pull_request ? context.payload.pull_request.number : null;
    if (!prNumber) {
        throw new Error('No pull request found in the context');
    }

    // Get PR reviews and store it in `reviews` variable
    const { data: reviews } = await octokit.pulls.listReviews({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: prNumber,
    });

    // Filter approved reviews
    const approvedReviews = reviews.filter(review => review.state === 'APPROVED');
    const requiredApprovals = parseInt(getInput('review_approvals_count'), 10) || 1;
    const hasRequiredApprovals = approvedReviews.length >= requiredApprovals;

    console.log(`Number of approved reviews: ${approvedReviews.length}`);
    console.log(`Required approvals: ${requiredApprovals}`);
    console.log(`Has required approvals: ${hasRequiredApprovals}`);

    // Get labels from the PR
    const labels = context.payload.pull_request.labels.map(label => label.name);
    console.log('Labels:', labels);

    // Check if the PR has the required labels
    const requiredLabels = getInput('approval_labels').split(',').map(label => label.trim()) || ["integration-test", "skip_integration"];
    const hasRequiredLabels = requiredLabels.every(label => labels.includes(label));
    console.log(`Required labels: ${requiredLabels}`);
    console.log(`Has required labels: ${hasRequiredLabels}`);

    if ( !hasRequiredApprovals ) {
        setFailed(`Pull request does not have the required number of approvals: ${requiredApprovals}`);
    }

    if ( !hasRequiredLabels ) {
        setFailed(`Pull request does not have the required labels: ${requiredLabels}`);
    }
    
    setOutput('status', hasRequiredApprovals && hasRequiredLabels);
    
} catch (error) {
    // If there's an error, set the action to failed
    setFailed(`Action failed with error: ${error.message}`);
}
